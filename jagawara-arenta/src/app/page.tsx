import Image from "next/image";
import Weather from "../components/weatherPrediction";

import { client } from "@/src/sanity/lib/client";
import { urlFor } from "@/src/sanity/lib/image";
import BeritaSlider from "@/src/components/BeritaSlider";
import Monitoring from "@/src/components/Monitoring";

export default async function Home() {
  const beritaQuery = `*[_type == "berita"] | order(_createdAt asc)`;
  const rawBeritaData = await client.fetch(beritaQuery, {}, { next: { revalidate: 60 } });
  const beritaData = rawBeritaData.map((item: any) => ({
      id: item._id,
      judul: item.judul,
      tahun: item.tahun,
      deskripsi: item.deskripsi,
      cover_foto: item.galeri_foto && item.galeri_foto.length > 0 ? urlFor(item.galeri_foto[0]).url() : null
  }));

  const arenQuery = `*[_type == "monitoringAren"] | order(nama_lahan asc) {
    _id, 
    nama_lahan, 
    jumlah_bibit, 
    survival_rate,
    "foto_lahan": foto_lahan[].asset->url
  }`;
  const lahanList = await client.fetch(arenQuery, {}, { next: { revalidate: 60 } });

  return (
    <div className="bg-[#f4f1ea] min-h-screen pb-16 font-sans">
      <div className="sticky top-0 z-50 p-2 lg:py-4 lg:px-8 bg-white w-full h-fit shadow-md border-b-[4px] border-[#0B592F] items-center flex justify-between lg:justify-start lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-1">
          <Image src="/icon/mountain.svg" alt="icon" fill className="object-contain" />
        </div>
        <div className="flex flex-col justify-center text-center lg:text-left leading-tight order-2 lg:order-3">
          <h1 className="text-[#0B592F] text-[20px] lg:text-[28px] font-bold tracking-tight">JAGAWARA ARENTA</h1>
          <h3 className="text-[#936440] text-[12px] lg:text-[14px] font-semibold">Dashboard Monitoring Cuaca dan Lingkungan</h3>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-3 lg:order-2">
          <Image src="/icon/CloudRain.svg" alt="icon" fill className="object-contain" />
        </div>
      </div>

      <main className="max-w-[1480px] mx-auto px-6 md:px-10 xl:px-8 mt-8 space-y-8">
        <section className="w-full drop-shadow-md">
            <Weather/>
        </section>
        
        <Monitoring/>

        <section className="p-4 rounded-2xl">
            <div className="mb-4 text-center">
              <h2 className="text-[#0B592F] text-[16px] md:text-[20px] lg:text-[24px] xl:text-[32px] leading-tight font-bold">Pemantauan Konservasi Aren</h2>
              <p className="text-gray-500 text-sm">Status pertumbuhan dan tingkat keselamatan pohon di setiap lokasi Penanaman</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between">
                {lahanList.map((lahan: any) => (
                    <div key={lahan._id} className="py-4 flex flex-col items-center">
                        <h2 className="text-[20px] md:text-[24px] text-center font-black text-[#936440]">{lahan.nama_lahan}</h2>
                        <div className="flex flex-col gap-4 items-center w-full">
                            <div className="flex flex-col items-center mt-2">
                                <span className="text-xs md:text-sm text-center font-bold text-gray-500 leading-tight mb-2">Tingkat Keselamatan<br/> (Survival Rate)</span>
                                <div className={`w-[120px] h-[120px] rounded-full p-4 flex justify-center items-center shadow-inner ${lahan.survival_rate >= 80 ? 'bg-green-50 border-2 border-green-200' : lahan.survival_rate >= 50 ? 'bg-amber-50 border-2 border-amber-200' : 'bg-red-50 border-2 border-red-200'}`}>
                                    <span className={`text-xl md:text-2xl font-black ${lahan.survival_rate >= 80 ? 'text-green-600' : lahan.survival_rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                        {lahan.survival_rate}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 w-full text-center">
                                <span className="text-sm font-bold text-gray-500">Total Bibit Ditanam: </span>
                                <span className="text-lg md:text-xl font-black text-gray-800">{lahan.jumlah_bibit} Pohon</span>
                            </div>

                            {lahan.foto_lahan && lahan.foto_lahan.length > 0 ? (
                                <div className="w-full h-32 md:h-40 relative rounded-xl overflow-hidden shadow-inner border border-gray-200">
                                    <Image 
                                      src={lahan.foto_lahan[0]} 
                                      alt={`Dokumentasi ${lahan.nama_lahan}`} 
                                      fill 
                                      className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-32 md:h-40 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                                    <span className="text-xs text-gray-400 font-medium italic">Belum ada foto</span>
                                </div>
                            )}
                            
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="w-full px-4">
          <h2 className="py-4 text-[#0B592F] text-center text-[16px] md:text-[20px] lg:text-[24px] xl:text-[32px] leading-tight font-bold">Riwayat Bencana Desa Cipelah</h2>
          {beritaData && beritaData.length > 0 ? (
            <BeritaSlider beritaData={beritaData} />
          ) : (
            <div className="w-fit flex flex-col items-center justify-center mx-auto py-16 px-4 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="text-5xl mb-4 grayscale opacity-50">📰</div>
              <h3 className="text-[#936440] text-[12px] xl:text-[20px] leading-tight font-bold mb-1">Belum Ada Catatan</h3>
              <p className="text-[#936440] text-[8px] xl:text-[14px] text-center max-w-md">Syukurlah, saat ini belum ada riwayat bencana atau pergerakan tanah yang tercatat di Desa Cipelah.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}