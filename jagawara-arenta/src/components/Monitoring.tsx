"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const EquipmentMap = dynamic(() => import('./EquipmentMap'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta...</div>
    )
});

const status = [
    {id: 1, name: "NORMAL", color: "bg-[#8CA70A]"},
    {id: 2, name: "SIAGA", color: "bg-[#DF6F3B]"},
    {id: 3, name: "WASPADA", color: "bg-[#EEB627]"},
    {id: 4, name: "AWAS", color: "bg-[#FF1100]"}
];

const sensorData = [
    { station: "Kantor Kades", id: "EWS-01", water: 45, humidity: 60, lat: -7.187398, lng: 107.283043 },
    { station: "Curug Cipelah", id: "EWS-02", water: 80, humidity: 75, lat: -7.195821, lng: 107.261151 },
];

export default function Monitoring(){
    const [titikFokus, setTitikFokus] = useState<{ lat: Number; lng: number} | null>(null);
    const petaRef = useRef<HTMLDivElement>(null);
    const handleKlikBaris = (lat: number, lng: number) => {
        setTitikFokus({ lat, lng });
        petaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return(
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-8">
            
            {/* Kiri: Peta Lokasi */}
            {/* Tambahkan ref={petaRef} di sini untuk target scroll */}
            <div ref={petaRef} className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden h-full scroll-mt-24">
                <div className="flex flex-col xl:flex-row justify-between p-4 items-start xl:items-center border-b border-[#936440]/20 bg-gray-50/50">
                    <div className="flex flex-col mb-3 xl:mb-0">
                        <span className="text-[20px] font-bold text-[#0B592F] leading-tight">Equipment Map</span>
                        <span className="text-[14px] text-[#936440] leading-tight">Klik Titik untuk Detail Sensor</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-2">
                        {status.map((item) => (
                        <div key={item.id} className="flex flex-row gap-2 items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-[#936440] font-semibold text-[12px]">{item.name}</span>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 min-h-[350px]">
                    {/* Lempar state titikFokus ke peta */}
                    {/* <EquipmentMap titikFokus={titikFokus} /> */}
                </div>
            </div>

            {/* Kanan: Tabel Data Sensor */}
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden h-full">
                <div className="p-4 border-b border-[#936440]/20 bg-gray-50/50">
                    <span className="text-[20px] font-bold text-[#0B592F] leading-tight block">Equipment Sensor Data</span>
                    <span className="text-[14px] text-[#936440] leading-tight">Water content and humidity level</span>
                </div>
                
                <div className="p-4 overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-[14px] text-[#936440] border-b-2 border-[#936440]/20">
                            <tr>
                                <th className="pb-3 font-bold">Station</th>
                                <th className="pb-3 font-bold">ID</th>
                                <th className="pb-3 font-bold">Water Content</th>
                                <th className="pb-3 font-bold">Humidity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#936440]/10">
                            {sensorData.map((data, index) => (
                            <tr 
                                key={index} 
                                // Tambahkan event onClick dan cursor-pointer di baris tabel
                                onClick={() => handleKlikBaris(data.lat, data.lng)}
                                className="hover:bg-orange-50/50 transition-colors cursor-pointer"
                                title="Klik untuk lihat di Peta"
                            >
                                <td className="py-5 font-bold text-[#0B592F]">{data.station}</td>
                                <td className="py-5 text-gray-500 font-medium">{data.id}</td>
                                <td className="py-5 w-1/4 pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-[#0B592F] h-2.5 rounded-full" style={{ width: `${data.water}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 w-8">{data.water}%</span>
                                    </div>
                                </td>
                                <td className="py-5 w-1/4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-[#DF6F3B] h-2.5 rounded-full" style={{ width: `${data.humidity}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 w-8">{data.humidity}%</span>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </section>
    );
}