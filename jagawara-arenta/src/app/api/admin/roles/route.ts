import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_roles')
      .select('*')
      .order('role', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal mengambil data', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, action } = await request.json();
    if (!email || !action) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 });
    }

    if (action === 'acc') {
      const { data, error } = await supabaseAdmin
        .from('admin_roles')
        .update({ role: 'admin' })
        .eq('email', email)
        .select(); 
        
      if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        return NextResponse.json({ message: `Gagal: Email ${email} tidak ditemukan di database` }, { status: 404 });
      }
      return NextResponse.json({ message: `Berhasil memberikan akses Admin ke ${email}` }, { status: 200 });
    } 
    else if (action === 'reject' || action === 'revoke') {
      const { error } = await supabaseAdmin
        .from('admin_roles')
        .delete()
        .eq('email', email);
        
      if (error) throw error;
      return NextResponse.json({ message: `Akses untuk ${email} berhasil dicabut` }, { status: 200 });
    }
    else {
      return NextResponse.json({ message: 'Aksi tidak valid' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error("API Route Error:", error.message);
    return NextResponse.json({ message: 'Gagal memproses aksi', error: error.message }, { status: 500 });
  }
}