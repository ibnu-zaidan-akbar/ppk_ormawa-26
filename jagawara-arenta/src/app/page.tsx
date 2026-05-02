"use client";
import Image from "next/image";
import Weather from "@/src/components/weatherPrediction"
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/EquipmentMap'), { 
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta...</div>
});

const status = [{id: 1, name: "Normal", color: "bg-[#8CA70A]"},
                {id: 2, name: "Siaga", color: "bg-[#DF6F3B]"},
                {id: 3, name: "Waspada", color: "bg-[#EEB627]"},
                {id: 4, name: "Awas", color: "bg-[#FF1100]"}];

export default function Home() {
  return (
    <div className="bg-desk">
      <div className="sticky p-2 lg:py-4 lg:px-8 bg-white w-full h-fit shadow-xl items-center flex justify-between lg:justify-start lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-1">
          <Image
            src="/icon/mountain.svg" alt="icon"
            fill className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center text-center lg:text-left leading-tight order-2 lg:order-3">
          <h1 className="text-[#0B592F] text-[24px] lg:text-[36px] font-bold">JAGAWARA ARENTA</h1>
          <h3 className="text-[#936440] text-[14px] lg:text-[20px] font-semi-bold">Sensor Dashboard</h3>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-3 lg:order-2">
          <Image
            src="/icon/CloudRain.svg" alt="icon"
            fill className="object-contain"
          />
        </div>
      </div>

      <div className="flex min-h-screen w-full flex-col items-center justify-between py-12 md:py-18 xl:py-24 px-4 md:px-10 xl:px-16 sm:items-start">
        <Weather/>
      </div>

      
      <div className="w-full xl:max-w-[1000px] mx-auto py-12 px-4">
        <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60">
            <div className="grid grid-cols-1 xl:grid-cols-[65%_35%] p-4 items-center">
              <div className="flex flex-col">
                <span className="text-[28px] font-bold text-[#0B592F] leading-tight">Lokasi Perangkat EWS</span>
                <span className="text-[20px] text-[#936440] leading-tight">Klik Titik untuk Detail Sensor</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {status.map((item) => (
                  <div key={item.id} className="flex flex-row gap-2 items-center">
                    <div className={`w-6 h-6 rounded-full ${item.color}`}></div>
                    <span className="text-[#936440] font-semibold text-[16px]">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <MapComponent />
        </div>
      </div>
    </div>
  );
}
