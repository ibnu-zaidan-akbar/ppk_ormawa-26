"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function BeritaSlider({ beritaData }: { beritaData: any[] }) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center justify-between w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto md:gap-6">
        {/* Tombol Kiri */}
        <button onClick={() => swiperRef.current?.slidePrev()} className="transition-all duration-300 hover:scale-110 active:scale-90 animate-nudge-left cursor-pointer hidden md:block">
          <svg viewBox="0 0 24 24" className="w-12 h-12 lg:w-20 lg:h-20 xl:w-24 xl:h-24 transition-colors hover:opacity-80">
            <path d="M19 18l-7-6 7-6v12z" fill="#936440" />
            <path d="M11 18l-7-6 7-6v12z" fill="#5F6282" />
          </svg>
        </button>

        {/* Kontainer Swiper Utama */}
        <div className="flex-1 min-w-0 w-full bg-white border-[3px] border-[#936440] rounded-lg overflow-hidden">
          <Swiper modules={[Pagination, Autoplay, Navigation]} pagination={{ clickable: true }} className="w-full"
                  autoplay={{ delay: 5000, disableOnInteraction: false }} onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {beritaData.map((item, index) => (
              <SwiperSlide key={item.id} className="w-full h-auto">
                <div className="flex flex-col w-full h-full">
                  <div className="relative w-full h-52 md:h-100 border-y-2 border-[#936440]">
                    <Image src={item.cover_foto} alt={item.judul} className="object-cover" fill sizes="(max-width: 768px) 100vw, 800px" priority={index === 0}/>
                  </div>
                  <p className="p-2 text-[20px] md:text-[24px] justify-between font-bold text-[#936440] text-center leading-snug line-clamp-6">{item.judul}</p>
                  <p className="px-4 text-[14px] md:text-[16px] justify-between font-semibold text-black text-justify leading-snug line-clamp-6">{item.deskripsi}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="text-right p-4">
            <Link href="/histori" className="inline-block text-xs md:text-sm text-[#936440] hover:text-[#7a5132]">Baca Histori Lengkap &rarr;</Link>
          </div>
        </div>

        {/* Tombol Kanan */}
        <button onClick={() => swiperRef.current?.slideNext()} className="transition-all duration-300 hover:scale-110 active:scale-90 animate-nudge-right cursor-pointer hidden md:block">
          <svg viewBox="0 0 24 24" className="w-12 h-12 lg:w-20 lg:h-20 xl:w-24 xl:h-24 transition-colors hover:opacity-80">
            <path d="M5 6l7 6-7 6V6z" fill="#936440" className="transition-colors hover:fill-white" />
            <path d="M13 6l7 6-7 6V6z" fill="#5F6282" />
          </svg>
        </button>
      </div>

      <style jsx global>{`
        @keyframes nudgeRight { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
        @keyframes nudgeLeft { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-5px); } }
        .animate-nudge-right { animation: nudgeRight 1.5s infinite ease-in-out; }
        .animate-nudge-left { animation: nudgeLeft 1.5s infinite ease-in-out; }
        .swiper-pagination-bullet { width: 8px !important; height: 8px !important; background: white !important; opacity: 0.5; }
        .swiper-pagination-bullet-active { width: 24px !important; opacity: 1; border-radius: 4px !important; background: #dc2626 !important; }
      `}</style>
    </div>
  );
}