"use client";
import dynamic from 'next/dynamic';

const EquipmentMap = dynamic(() => import('./EquipmentMap'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta...</div>
    )
});

export default function MapWrapper() {
    return <EquipmentMap />;
}