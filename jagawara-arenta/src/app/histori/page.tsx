import { client } from '@/src/sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

interface Berita {
    _id: string;
    judul: string;
    tahun: number;
    deskripsi: string;
    galeri_foto: string[];
}

export const revalidate = 60;

export default async function HistoriBencanaPage() {
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
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[#936440] bg-white border border-[#936440]/20 rounded-lg shadow-sm hover:bg-[#936440] hover:text-white transition-all font-bold text-sm group w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard
        </Link>

        <h1 className="text-4xl font-black text-[#0B592F] py-2">Histori Bencana</h1>
        <p className="text-[#936440]">Catatan kejadian pergerakan tanah dan longsor di area pantauan.</p>

        <div className="space-y-8 py-8">
          {dataBerita.length === 0 && (
            <p className="text-center text-gray-500 italic">Belum ada catatan histori bencana.</p>
          )}

          {dataBerita.map((berita) => (
            <div key={berita._id} className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{berita.judul}</h2>
                <span className="bg-[#0B592F]/20 text-[#0B592F]/90 font-bold px-4 py-1 rounded-full text-sm">
                  {berita.tahun}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-wrap">{berita.deskripsi}</p>
              {berita.galeri_foto && berita.galeri_foto.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Dokumentasi Visual</h3>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
                    {berita.galeri_foto.map((url, index) => (
                      <div key={index} className="relative h-40 md:h-60 w-[286px] md:w-[400px] flex-shrink-0 rounded-xl overflow-hidden shadow-sm snap-start bg-gray-100">
                        <Image src={url} alt={`Dokumentasi ${berita.judul} ${index + 1}`} fill className="object-contain hover:scale-105 transition-transform duration-300"/>
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