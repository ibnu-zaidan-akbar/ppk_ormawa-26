import { NextResponse } from 'next/server';
import { client } from '@/src/sanity/lib/client';

export const revalidate = 0;

export async function GET() {
  try {
    const data = await client.fetch(`*[_type == "monitoringAren"] | order(_createdAt asc) {
      _id,
      nama_lahan,
      jumlah_bibit,
      survival_rate,
      "foto_lahan": foto_lahan[]{
        "key": _key,
        "ref": asset._ref,
        "url": asset->url
      }
    }`);
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Sanity GET Error:", error);
    return NextResponse.json({ message: 'Gagal mengambil data aren', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    const jumlah_bibit = Number(formData.get('jumlah_bibit'));
    const survival_rate = Number(formData.get('survival_rate'));
    
    const existingPhotosRaw = formData.get('existingPhotos') as string;
    let finalPhotos: any[] = existingPhotosRaw ? JSON.parse(existingPhotosRaw) : [];
    const newFiles = formData.getAll('newFoto') as File[];
    
    for (const file of newFiles) {
      if (file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const asset = await client.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        });
        
        finalPhotos.push({
          _key: crypto.randomUUID(),
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id },
        });
      }
    }

    const updatedDoc = await client
      .patch(id)
      .set({ 
        jumlah_bibit, 
        survival_rate,
        foto_lahan: finalPhotos.length > 0 ? finalPhotos : null 
      })
      .commit();

    return NextResponse.json({ message: 'Data lahan berhasil diperbarui', data: updatedDoc }, { status: 200 });
  } catch (error: any) {
    console.error("Sanity PUT Error:", error);
    return NextResponse.json({ message: 'Gagal memperbarui data', error: error.message }, { status: 500 });
  }
}