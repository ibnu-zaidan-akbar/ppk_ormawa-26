import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';
export async function GET(){
  try{
    const { data, error } = await supabaseAdmin
      .from('titik_koordinat')
      .select('*')
      .order('kategori', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any){
    return NextResponse.json({ message: 'Gagal mengambil data', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request){
  try{
    const body = await request.json();
    let { node_id, kategori, nama_lokasi, latitude, longitude } = body;
    if (kategori !== 'EWS' || node_id === '') {
      node_id = null;
    }

    const{ data, error } = await supabaseAdmin
      .from('titik_koordinat')
      .insert([{ node_id, kategori, nama_lokasi, latitude, longitude }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Titik berhasil ditambahkan', data }, { status: 201 });
  } catch (error: any){
    if (error.code === '23505'){
      return NextResponse.json({ message: 'Gagal: Node ID tersebut sudah digunakan!' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal menambah data', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request){
  try{
    const body = await request.json();
    let { id, node_id, kategori, nama_lokasi, latitude, longitude } = body;
    if (!id) return NextResponse.json({ message: 'ID wajib disertakan' }, { status: 400 });
    if (kategori !== 'EWS' || node_id === ''){
      node_id = null;
    }

    const { data, error } = await supabaseAdmin
      .from('titik_koordinat')
      .update({ node_id, kategori, nama_lokasi, latitude, longitude, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ message: 'Titik berhasil diperbarui', data }, { status: 200 });
  } catch (error: any) {
    if (error.code === '23505'){
      return NextResponse.json({ message: 'Gagal: Node ID tersebut sudah digunakan di tempat lain!' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Gagal memperbarui data', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request){
  try{
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID wajib disertakan' }, { status: 400 });
    const { error } = await supabaseAdmin
      .from('titik_koordinat')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return NextResponse.json({ message: 'Titik berhasil dihapus' }, { status: 200 });
  } catch (error: any){
    if (error.code === '23503'){
      return NextResponse.json({ 
        message: 'Ditolak: Titik ini tidak bisa dihapus karena sudah memiliki riwayat data sensor! Silakan Edit/Pindahkan lokasinya saja.' 
      }, { status: 403 });
    }
    return NextResponse.json({ message: 'Gagal menghapus data', error: error.message }, { status: 500 });
  }
}