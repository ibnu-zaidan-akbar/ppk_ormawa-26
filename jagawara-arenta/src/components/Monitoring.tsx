"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const EquipmentMap = dynamic(() => import("./EquipmentMap"), { ssr: false });

export default function Monitoring(){
    const [titikFokus, setTitikFokus] = useState<{ lat: Number; lng: number} | null>(null);
    const petaSectionRef = useRef<HTMLDivElement>(null);
    const handleKlikBaris = (lat: number, lng: number) => {
        setTitikFokus({ lat, lng });
        petaSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return(
        <main>default</main>
    );
}