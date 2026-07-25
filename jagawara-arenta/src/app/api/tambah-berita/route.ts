import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const judul = formData.get('judul') as string;
    const tahun = parseInt(formData.get('tahun') as string);
    const deskripsi = formData.get('deskripsi') as string;
    const files = formData.getAll('foto') as File[];

    if (!judul || !deskripsi || files.length === 0) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const asset = await writeClient.assets.upload('image', file, {
          filename: file.name,
        });
        
        return {
          _key: asset._id,
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        };
      })
    );

    const doc = {
      _type: 'berita',
      judul,
      tahun,
      deskripsi,
      galeri_foto: uploadedImages,
    };

    const result = await writeClient.create(doc);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error saat upload ke Sanity:', error);
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan' }, { status: 500 });
  }
}