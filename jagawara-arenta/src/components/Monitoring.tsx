"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const EquipmentMap = dynamic(() => import('./EquipmentMap'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta...</div>
    )
});

const status = [
    {id: 1, name: "NORMAL", color: "bg-[#8CA70A]"},
    {id: 2, name: "WASPADA", color: "bg-[#EEB627]"},
    {id: 3, name: "SIAGA", color: "bg-[#DF6F3B]"},
    {id: 4, name: "AWAS", color: "bg-[#FF1100]"}
];

interface SensorData {
    id: string;
    station: string;
    lat: number;
    lng: number;
    status: string;
    statusColor: string;
    battery: number;
    batteryStatus: string;
    curah_hujan: number;
    kelembapan: number;
    kemiringan: number;
    getaran: number;
    last_update: string | null;
}

export default function Monitoring(){
    const [titikFokus, setTitikFokus] = useState<{ lat: number; lng: number} | null>(null);
    const petaRef = useRef<HTMLDivElement>(null);

    const [sensorData, setSensorData] = useState<SensorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchLiveSensor = async () => {
            try {
                const res = await fetch('api/live-sensor', { cache: 'no-store' });
                const result = await res.json();

                if(res.ok){
                    setSensorData(result.data);
                }
            } catch(error){
                console.error("Gagal menarik  data live sensor:", error)
            } finally {
                setIsLoading(false);
            }
        };

        fetchLiveSensor();
        const intervalId = setInterval(() => {
            fetchLiveSensor();
        }, 15000);
        return () => clearInterval(intervalId)
    }, [])

    const handleKlikBaris = (lat: number, lng: number) => {
        setTitikFokus({ lat, lng });
        petaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return(
        <section className="flex flex-col gap-8 w-full">
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden h-full">
                <div className="p-4 border-b border-[#936440]/20 bg-gray-50/50 -mb-4 flex justify-between items-center">
                    <div>
                        <span className="text-[20px] font-bold text-[#0B592F] leading-tight block">Sensor Data Lapangan</span>
                        <span className="text-[14px] text-[#936440] leading-tight">Live monitoring status data</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font bold text-green-600 uppercase tracking wider">Live Update</span>
                    </div>
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
                            {isLoading ?  (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-[#936440] font-semibold animate-pulse">
                                        Menarik data langsung dari lereng...
                                    </td>
                                </tr>
                            ) : sensorData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-8 text-center text-gray-500 font-semibold">
                                        Belum ada data sensor yang masuk.
                                    </td>
                                </tr>
                            ) : (
                                sensorData.map((data, index) => (
                                <tr key={index} onClick={() => handleKlikBaris(data.lat, data.lng)} className="hover:bg-orange-100/60 transition-colors cursor-pointer">
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
                                ))
                            )}
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