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
  { 
    station: 'Kantor Desa', 
    id: 'EWS-01', 
    status: 'NORMAL',
    statusColor: 'bg-[#8CA70A]', 
    battery: 85, 
    batteryStatus: 'Discharge', 
    curah_hujan: '0', 
    kelembapan: 45, 
    kemiringan: '0.1', 
    getaran: '0.01',
    lat: -7.187398,
    lng: 107.283043
  },
  { 
    station: 'Curug Cipelah', 
    id: 'EWS-02', 
    status: 'SIAGA',
    statusColor: 'bg-[#DF6F3B]', 
    battery: 42, 
    batteryStatus: 'Charge', 
    curah_hujan: '12', 
    kelembapan: 78, 
    kemiringan: '1.2', 
    getaran: '0.05',
    lat: -7.195821,
    lng: 107.261151
  },
];

export default function Monitoring(){
    const [titikFokus, setTitikFokus] = useState<{ lat: number; lng: number} | null>(null);
    const petaRef = useRef<HTMLDivElement>(null);
    const handleKlikBaris = (lat: number, lng: number) => {
        setTitikFokus({ lat, lng });
        petaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return(
        <section className="flex flex-col gap-8 w-full">
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden h-full">
                <div className="p-4 border-b border-[#936440]/20 bg-gray-50/50">
                    <span className="text-[20px] font-bold text-[#0B592F] leading-tight block">Sensor Data Lapangan</span>
                    <span className="text-[14px] text-[#936440] leading-tight">Live monitoring status data</span>
                </div>
                
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-[14px] text-[#936440] border-b-2 border-[#936440]/20 bg-orange-50/30">
                            <tr>
                                <th className="py-4 px-4 font-bold">Titik</th>
                                <th className="py-4 px-4 font-bold">ID</th>
                                <th className="py-4 px-4 font-bold text-center">Status</th>
                                <th className="py-4 px-4 font-bold">Baterai</th>
                                <th className="py-4 px-4 font-bold">Status Baterai</th>
                                <th className="py-4 px-4 font-bold">Curah Hujan</th>
                                <th className="py-4 px-4 font-bold">Kelembapan Tanah</th>
                                <th className="py-4 px-4 font-bold">Kemiringan</th>
                                <th className="py-4 px-4 font-bold">Getaran</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#936440]/10">
                            {sensorData.map((data, index) => (
                            <tr key={index} onClick={() => handleKlikBaris(data.lat, data.lng)} className="hover:bg-orange-100/60 transition-colors">
                                <td className="py-4 px-4 font-bold text-[#0B592F]">{data.station}</td>
                                <td className="py-4 px-4 text-gray-500 font-medium">{data.id}</td>
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wider uppercase ${data.statusColor}`}>
                                        {data.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 min-w-[120px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${data.battery > 50 ? 'bg-[#8CA70A]' : 'bg-red-500'}`} style={{ width: `${data.battery}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 w-8">{data.battery}%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 font-bold text-[#936440]">{data.batteryStatus}</td>
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.curah_hujan} mm/jam</td>
                                <td className="py-4 px-4 font-bold text-[#DF6F3B]">{data.kelembapan}%</td>
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.kemiringan} °</td>
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.getaran} g</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div ref={petaRef} className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60">
                <div className="flex justify-between p-4 items-center border-b border-[#936440]/20 bg-gray-50/50 rounded-t-xl">
                    <div className="flex flex-col">
                        <span className="text-[20px] font-bold text-[#0B592F] leading-tight">Peta Desa</span>
                        <span className="text-[14px] text-[#936440] leading-tight">Klik Titik untuk Detail Sensor</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        {status.map((item) => (
                        <div key={item.id} className="flex flex-row gap-2 items-center">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-[#936440] font-semibold text-[12px]">{item.name}</span>
                        </div>
                        ))}
                    </div>
                </div>
                <div className="w-full h-[450px] relative z-0 rounded-b-xl overflow-hidden">
                    <EquipmentMap titikFokus={titikFokus}/>
                </div>
            </div>
        </section>
    );
}