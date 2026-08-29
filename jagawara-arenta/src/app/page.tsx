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

        <section className="w-full py-4">
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