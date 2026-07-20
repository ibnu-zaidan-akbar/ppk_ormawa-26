'use client'
import { useState, useEffect, useRef, Suspense } from 'react';
import { messaging, getToken, onMessage } from '../lib/firebase'
import { createClient } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import AOS from "aos"
import 'aos/dist/aos.css';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function NotificationLogic() {
    const searchParams = useSearchParams();

    useEffect(() => {
            AOS.init({ duration: 700, once: true });
        }, []);
        
    const [showSiaga, setShowSiaga] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [fcmToken, setFcmToken] = useState<string>('');
    const [incomingData, setIncomingData] = useState<any>(null);

    const audioPlayer = useRef<HTMLAudioElement | null>(null);

    const triggerNotification = (level: 'siaga' | 'waspada' | 'awas', dataSensor?: any) => {
        if (audioPlayer.current) {
            audioPlayer.current.pause();
            audioPlayer.current.removeAttribute('src');
            audioPlayer.current.load();
            audioPlayer.current = null;
        }

        if (dataSensor) setIncomingData(dataSensor);

        let audioPath = '';
        if (level === 'siaga') {
            audioPath = '/audio/siaga.mp3';
            setShowSiaga(true);
        } else if (level === 'waspada') {
            audioPath = '/audio/waspada.mp3';
            setShowToast(true);
        } else if (level === 'awas') {
            audioPath = '/audio/awas.mp3';
            setShowModal(true);
        }

        const newAudio = new Audio(audioPath);
        newAudio.loop = true;
        newAudio.play().catch((err) => console.error(`Gagal memutar audio:`, err));
        audioPlayer.current = newAudio;
    };

    const closeNotification = (level: 'siaga' | 'waspada' | 'awas') => {
        if (level === 'siaga') setShowSiaga(false);
        if (level === 'waspada') setShowToast(false);
        if (level === 'awas') setShowModal(false);

        if (audioPlayer.current) {
            audioPlayer.current.pause();
            audioPlayer.current.removeAttribute('src');
            audioPlayer.current.load();
            audioPlayer.current = null;
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && messaging) {
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Pesan diterima saat web terbuka:', payload);
                const level = payload.data?.level as 'siaga' | 'waspada' | 'awas';
                if (level) {
                    triggerNotification(level, payload.data);
                }
            });
            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        const alertLevel = searchParams.get('alert') as 'siaga' | 'waspada' | 'awas';
        if (alertLevel) {
            console.log('Web dibuka dari klik notifikasi! Level:', alertLevel);
            setTimeout(() => {
                triggerNotification(alertLevel);
            }, 500);
        }
    }, [searchParams]);

    const requestPermission = async () => {
        try {
            const permission = await window.Notification.requestPermission();
            
            if (permission === 'granted') {
                console.log('Izin diberikan! Sedang mengambil token...');
                
                if (messaging) {
                    const token = await getToken(messaging, {
                        vapidKey: 'BJlCuEzsuPopaWON9mQ5AokB8-vFyzIAnaq6k9dUoByIIDfH1-HKZ7UJa7QLa22y3RKY9eYT2SMv2mnwkJvlWJo' 
                    });
                    
                    if (token) {
                        console.log('Berhasil dapat Token:', token);
                        setFcmToken(token);
                        
                        // ===== LOGIKA BARU: INSERT KE SUPABASE =====
                        console.log('Menyimpan token ke database...');
                        const { error } = await supabase
                            .from('fcm_tokens')
                            .insert([{ token: token }]);

                        if (error) {
                            if (error.code === '23505') {
                                console.log('✅ Aman! Token HP ini sudah terdaftar di database.');
                            } else {
                                console.error('❌ Gagal menyimpan token:', error.message);
                            }
                        } else {
                            console.log('✅ Sukses! Token baru berhasil ditambahkan ke database EWS.');
                        }

                    } else {
                        console.log('Gagal mendapatkan token dari Google.');
                    }
                }
            } else {
                console.log('Warga menolak memberikan izin notifikasi.');
            }
        } catch (error) {
            console.error('Terjadi kesalahan saat meminta token:', error);
        }
    };

    const testTriggerBackend = (level: string) => {
        console.log("Menyuruh balai desa menembak massal... Cepat minimize browser!");
        setTimeout(async () => {
            try {
                const res = await fetch('/api/trigger-alarm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        level: level 
                    })
                });
                const data = await res.json();
                console.log("Respon Tembakan Massal:", data);
            } catch (error) {
                console.error("Gagal memanggil API", error);
            }
        }, 5000); 
    };

    return (
        <div className="p-10 h-[500px] bg-[#f4f1ea] flex flex-col items-center justify-center font-sans">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center mb-10 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Simulasi Trigger Sensor</h2>
                <button onClick={requestPermission} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors mb-4">
                    Aktifkan Notifikasi Darurat
                </button>
                <div className="flex flex-col gap-3">
                    <button onClick={() => triggerNotification('siaga')} className="w-full py-3 bg-yellow-500 text-white rounded-lg font-bold shadow hover:bg-yellow-600 transition-colors cursor-pointer">Trigger SIAGA (Slide-in Orange)</button>
                    <button onClick={() => triggerNotification('waspada')} className="w-full py-3 bg-orange-500 text-white rounded-lg font-bold shadow hover:bg-orange-600 transition-colors">Trigger WASPADA (Slide-in)</button>
                    <button onClick={() => triggerNotification('awas')} className="w-full py-3 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 transition-colors">Trigger AWAS (Full Screen)</button>

                    {fcmToken && (
                        <button onClick={() => testTriggerBackend('awas')} className="w-full mt-4 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg border-2 border-purple-900">
                            🚀 UJI COBA TEMBAK NOTIFIKASI MASSAL
                        </button>
                    )}
                </div>
            </div>

            {showSiaga && (
                <div data-aos="fade-left" data-aos-duration="700" className="fixed top-5 right-5 z-50 flex items-start p-4 w-full max-w-sm bg-white rounded-xl shadow-2xl border-l-8 border-yellow-500 transform transition-all">
                    <div className="text-2xl mr-3">🔔</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-700 leading-tight">Status Siaga</h3>
                        <p className="text-sm text-gray-600 mt-1">Curah hujan mulai meningkat di <b>Tebing A</b>. Sistem mulai memantau intensif.</p>
                    </div>
                    <button onClick={() => closeNotification('siaga')} className="ml-3 text-gray-400 hover:text-gray-800 font-bold p-1 cursor-pointer">✕</button>
                </div>
            )}

            {showToast && (
                <div data-aos="fade-left" data-aos-duration="700" className="fixed top-5 right-5 z-50 flex items-start p-4 w-full max-w-sm bg-white rounded-xl shadow-2xl border-l-8 border-orange-500 transform transition-all">
                    <div className="text-2xl mr-3">⚠️</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-orange-700 leading-tight">Status Waspada</h3>
                        <p className="text-sm text-gray-600 mt-1">Sensor kelembapan tanah di <b>Tebing A</b> menunjukkan anomali. Terus pantau grafik.</p>
                    </div>
                    <button onClick={() => closeNotification('waspada')} className="ml-3 text-gray-400 hover:text-gray-800 font-bold p-1 cursor-pointer">✕</button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none"></div>
                    <div data-aos="fade-up" data-aos-duration="1000" className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm md:max-w-md w-full mx-4 text-center border-4 border-red-600">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner animate-bounce"><span className="text-4xl">🚨</span></div>
                        <h2 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-widest">Awas Bahaya!</h2>
                        <p className="text-gray-800 font-medium mb-6">Pergerakan tanah dan getaran ekstrem terdeteksi. <b>Segera jauhi lokasi tebing!</b></p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left border border-gray-200 shadow-inner">
                            <p className="font-bold text-gray-700 mb-2 border-b pb-2">Detail Data Masuk:</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex justify-between">
                                    <span>Kemiringan (Tilt):</span>
                                    <span className="font-bold text-red-600 animate-pulse">{incomingData?.kemiringan || '> 15'} Derajat</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Getaran:</span> 
                                    <span className="font-bold text-red-600">{incomingData?.getaran || 'Tinggi'} Hz</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Curah Hujan:</span>
                                    <span className="font-bold text-red-600">{incomingData?.curah_hujan || 'Tinggi'} mm/jam</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Kelembapan Tanah:</span>
                                    <span className="font-bold text-orange-600">{incomingData?.kelembapan || 'Basah'} %</span>
                                </li>
                            </ul>
                        </div>

                        <button onClick={() => closeNotification('awas')} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3 cursor-pointer">
                            <span className="text-xl">🔕</span> Matikan Sirine & Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function NotificationManager() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-bold">Memuat Sistem Notifikasi...</div>}>
            <NotificationLogic />
        </Suspense>
    );
}