import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const generateKey = () => Math.random().toString(36).substring(2, 15);

export async function GET(request: Request){
  try{
    const query = `*[_type == "berita"] | order(tahun desc) {
      _id, judul, tahun, deskripsi,
      "fotoList": foto[]{
        "key": _key,
        "ref": asset._ref,
        "url": asset->url
      }
    }`;
    const data = await sanityClient.fetch(query);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any){
    return NextResponse.json({ message: 'Gagal mengambil data', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const tahun = Number(formData.get('tahun'));
    const deskripsi = formData.get('deskripsi') as string;
    const files = formData.getAll('foto') as File[];

    if (!judul || !deskripsi || files.length === 0) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const imageAssets = [];
    for (const file of files) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await sanityClient.assets.upload('image', buffer, { filename: file.name });
        imageAssets.push({
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: asset._id }
        });
      }
    }

    const doc = {
      _type: 'berita',
      judul,
      tahun,
      deskripsi,
      galeri_foto: imageAssets,
    };
    const result = await sanityClient.create(doc);
    return NextResponse.json({ message: 'Berita berhasil ditambahkan', data: result }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal menambah berita', error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const judul = formData.get('judul') as string;
    const tahun = Number(formData.get('tahun'));
    const deskripsi = formData.get('deskripsi') as string;
    const existingPhotosStr = formData.get('existringPhotos') as string;
    const existingPhotos = existingPhotosStr ? JSON.parse(existingPhotosStr) : [];

    const newFiles = formData.getAll('newFoto') as File[];
    const newImageAssets = [];

    for (const file of newFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await sanityClient.assets.upload('image', buffer, { filename: file.name });
        newImageAssets.push({
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: asset._id }
        });
      }
    }

    const finalPhotos = [...existingPhotos, ...newImageAssets];
    const result = await sanityClient
      .patch(id)
      .set({ judul, tahun, deskripsi, foto: finalPhotos })
      .commit();

    return NextResponse.json({ message: 'Berita berhasil diperbarui', data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal memperbarui berita', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ message: 'ID wajib diisi' }, { status: 400 });

    await sanityClient.delete(id);
    return NextResponse.json({ message: 'Berita dihapus' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Gagal hapus', error: error.message }, { status: 500 });
  }
}