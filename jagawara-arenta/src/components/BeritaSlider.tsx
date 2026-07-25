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
    <div className="w-full flex flex-col items-center relative">
      <div className="flex items-center justify-between w-full group relative">
        
        {/* Tombol Kiri */}
        <button 
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 z-20 transition-all duration-300 hover:scale-110 active:scale-90 animate-nudge-left cursor-pointer hidden md:block"
        >
          <svg viewBox="0 0 24 24" className="w-12 h-12 lg:w-20 lg:h-20 xl:w-[100px] xl:h-[100px]">
            <path d="M19 18l-7-6 7-6v12z" fill="#9CA3AF" fillOpacity="0.6" className="transition-colors hover:fill-white" />
            <path d="M11 18l-7-6 7-6v12z" fill="white" />
          </svg>
        </button>

        {/* Kontainer Swiper Utama */}
        <div className="flex-1 mx-2 md:mx-16 relative rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900 h-[400px] md:h-[550px]">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            className="w-full h-full"
          >
            {beritaData.map((item, index) => (
              <SwiperSlide key={item.id} className="relative w-full h-full">
                {/* Background Gambar (Diambil 1 foto saja dari cover_foto) */}
                {item.cover_foto && (
                  <Image 
                    src={item.cover_foto} 
                    alt={item.judul} 
                    fill 
                    sizes="(max-width: 640px) 100vw, 1200px"
                    className="object-cover opacity-50"
                    priority={index === 0}
                  />
                )}
                
                {/* Konten Teks di Atas Gambar */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                  <h3 className="text-2xl md:text-4xl font-black mb-4 text-white uppercase tracking-widest drop-shadow-lg">
                    {item.judul}
                  </h3>
                  <p className="text-sm md:text-lg text-gray-200 leading-relaxed max-w-3xl line-clamp-3 mb-6 drop-shadow-md">
                    {item.deskripsi}
                  </p>
                  
                  {/* Link menuju halaman full histori */}
                  <Link href="/histori" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-lg">
                    Baca Histori Selengkapnya
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Tombol Kanan */}
        <button 
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 z-20 transition-all duration-300 hover:scale-110 active:scale-90 animate-nudge-right cursor-pointer hidden md:block"
        >
          <svg viewBox="0 0 24 24" className="w-12 h-12 lg:w-20 lg:h-20 xl:w-[100px] xl:h-[100px]">
            <path d="M5 6l7 6-7 6V6z" fill="#9CA3AF" fillOpacity="0.6" className="transition-colors hover:fill-white" />
            <path d="M13 6l7 6-7 6V6z" fill="white" />
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