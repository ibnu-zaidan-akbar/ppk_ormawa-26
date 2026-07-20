import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { createClient } from '@supabase/supabase-js';

if (getApps().length === 0) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        let level = '';
        let dataSensor = null;
        if (body.record) {
            level = body.record.status;
            dataSensor = {
                kemiringan: body.record.kemiringan,
                getaran: body.record.getaran,
                kelembapan: body.record.kelembapan,
                curah_hujan: body.record.curah_hujan
            };
        } else {
            level = body.level;
            dataSensor = body;
        }

        if (level === 'aman' || !level) {
            return NextResponse.json({ message: 'Aman terkendali. Tidak ada notif dikirim.' });
        }

        const { data: tokensData, error } = await supabase
            .from('fcm_tokens')
            .select('token');

        if (error || !tokensData || tokensData.length === 0) {
            return NextResponse.json({ error: 'Tidak ada token warga di database' }, { status: 400 });
        }

        const registrationTokens = tokensData.map((row) => row.token);
        let title = 'Info EWS';
        let bodyMsg = 'Pesan sistem berjalan normal.';
        
        if (level === 'awas') {
            title = '🚨 AWAS BAHAYA TINGKAT TINGGI!';
            bodyMsg = 'Pergerakan tanah ekstrem. Jauhi lokasi tebing sekarang juga!';
        } else if (level === 'waspada') {
            title = '⚠️ STATUS WASPADA';
            bodyMsg = 'Anomali kelembapan dan getaran terdeteksi di area pemantauan.';
        } else if (level === 'siaga') {
            title = '⚠️ STATUS SIAGA';
            bodyMsg = 'Anomali kelembapan dan getaran terdeteksi kecil di area pemantauan, hati-hati.';
        }

        const message = {
            tokens: registrationTokens,
            data: {
                level: level,
                title: title,
                bodyMsg: bodyMsg,
                kemiringan: String(dataSensor?.kemiringan || '0'), 
                getaran: String(dataSensor?.getaran || '0'),
                kelembapan: String(dataSensor?.kelembapan || '0'),
                curah_hujan: String(dataSensor?.curah_hujan || '0')
            }
        };

        const response = await getMessaging().sendEachForMulticast(message);        
        console.log(`Berhasil kirim ke ${response.successCount} HP. Gagal: ${response.failureCount}`);
        return NextResponse.json({ 
            success: true, 
            sent: response.successCount,
            failed: response.failureCount
        });

    } catch (error) {
        console.error('Gagal menembakkan notifikasi:', error);
        return NextResponse.json({ error: 'Gagal mengirim pesan darurat' }, { status: 500 });
    }
}