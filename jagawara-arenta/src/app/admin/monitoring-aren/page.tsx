"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function MonitoringSensorAdmin() {
  return (
    <main className="bg-gray-100 min-h-screen px-4 md:px-8 lg:px-10 py-10 font-sans">
        <div className="w-full mx-auto flex flex-col gap-2">
            <div>
            <h1 className="text-center md:text-start text-[28px] md:text-[32px] lg:text-[36px] font-black text-black uppercase tracking-wider">Monitoring Survival Rate Aren</h1>
            <p className="text-center md:text-start text-[12px] md:text-[16px] lg:text-[20px] text-gray-500">Pemantauan area konservasi pohon aren di desa</p>
            </div>

            
        </div>
    </main>
  );
}