import { client } from '@/src/sanity/lib/client'; // Sesuaikan path ini jika berbeda
import Image from 'next/image';

// Tipe data untuk TypeScript
interface Berita {
    _id: string;
    judul: string;
    tahun: number;
    deskripsi: string;
    galeri_foto: string[]; // Berisi deretan URL gambar
}

export const dynamic = 'force-dynamic';

export default async function HistoriBencanaPage() {
  // Mengambil data dari Sanity. Trik: "galeri_foto[].asset->url" langsung mengekstrak URL foto asli!
  const dataBerita: Berita[] = await client.fetch(`
    *[_type == "berita"] | order(tahun desc) {
      _id,
      judul,
      tahun,
      deskripsi,
      "galeri_foto": galeri_foto[].asset->url
    }
  `);

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gray-800 mb-2">Histori Bencana</h1>
        <p className="text-gray-600 mb-10">Catatan kejadian pergerakan tanah dan longsor di area pantauan.</p>

        <div className="space-y-12">
          {dataBerita.length === 0 && (
            <p className="text-center text-gray-500 italic">Belum ada catatan histori bencana.</p>
          )}

          {dataBerita.map((berita) => (
            <div key={berita._id} className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
              
              {/* Header: Judul & Tahun */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{berita.judul}</h2>
                <span className="bg-red-100 text-red-700 font-bold px-4 py-1 rounded-full text-sm">
                  {berita.tahun}
                </span>
              </div>

              {/* Teks Deskripsi */}
              <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">
                {berita.deskripsi}
              </p>

              {/* Galeri Foto (Grid) */}
              {berita.galeri_foto && berita.galeri_foto.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Dokumentasi Visual</h3>
                  {/* Grid dinamis: Menyesuaikan jumlah foto */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {berita.galeri_foto.map((url, index) => (
                      <div key={index} className="relative h-40 md:h-48 w-full rounded-xl overflow-hidden shadow-sm">
                        <Image
                          src={url}
                          alt={`Dokumentasi ${berita.judul} ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}