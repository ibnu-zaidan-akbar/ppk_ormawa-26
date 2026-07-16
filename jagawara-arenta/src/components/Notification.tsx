'use client'
import { useState } from 'react';

export default function Notification() {
    // State sementara untuk mensimulasikan trigger dari Supabase nanti
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-10 h-[500px] bg-gray-100 flex flex-col items-center justify-center font-sans">
            
            {/* --- BAGIAN 1: TOMBOL SIMULASI (Hanya untuk testing) --- */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center mb-10 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Simulasi Trigger Sensor</h2>
                <p className="text-sm text-gray-500 mb-6">Klik tombol di bawah untuk melihat kemunculan UI Notifikasi PWA.</p>
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => setShowToast(true)} 
                        className="w-full py-3 bg-yellow-500 text-white rounded-lg font-bold shadow hover:bg-yellow-600 transition-colors"
                    >
                        Trigger WASPADA (Slide-in)
                    </button>
                    <button 
                        onClick={() => setShowModal(true)} 
                        className="w-full py-3 bg-red-600 text-white rounded-lg font-bold shadow hover:bg-red-700 transition-colors"
                    >
                        Trigger AWAS (Full Screen)
                    </button>
                </div>
            </div>


            {/* --- BAGIAN 2: UI TOAST (Status Waspada) --- */}
            {/* Menggunakan animasi 'translate' agar meluncur mulus dari kanan */}
            {showToast && (
                <div className="fixed top-5 right-5 z-50 flex items-start p-4 w-full max-w-sm bg-white rounded-xl shadow-2xl border-l-8 border-yellow-500 transform transition-all duration-300 ease-out animate-in slide-in-from-right-16">
                    <div className="text-2xl mr-3">⚠️</div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-yellow-700 leading-tight">Status Waspada</h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Sensor kelembapan tanah di <b>Tebing A</b> menunjukkan anomali. Terus pantau grafik.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowToast(false)} 
                        className="ml-3 text-gray-400 hover:text-gray-800 font-bold p-1"
                    >
                        ✕
                    </button>
                </div>
            )}


            {/* --- BAGIAN 3: UI MODAL DARURAT (Status Awas) --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
                    
                    {/* Efek Latar Belakang Berkedip Merah (Emergency Vibe) */}
                    <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none"></div>

                    {/* Kotak Modal Utama */}
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm md:max-w-md w-full mx-4 text-center border-4 border-red-600 animate-in zoom-in-95 duration-200">
                        
                        {/* Ikon Sirine Bouncing */}
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner animate-bounce">
                            <span className="text-4xl">🚨</span>
                        </div>
                        
                        <h2 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-widest">
                            Awas Bahaya!
                        </h2>
                        <p className="text-gray-800 font-medium mb-6">
                            Pergerakan tanah dan getaran ekstrem terdeteksi. <b>Segera jauhi lokasi tebing!</b>
                        </p>
                        
                        {/* Kotak Rincian Sensor */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-left border border-gray-200 shadow-inner">
                            <p className="font-bold text-gray-700 mb-2 border-b pb-2">Detail Data Masuk:</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex justify-between">
                                    <span>Titik Lokasi:</span> <span className="font-bold text-gray-900">Tebing A (Node-01)</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Kemiringan (Tilt):</span> <span className="font-bold text-red-600 animate-pulse">15 Derajat</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Curah Hujan:</span> <span className="font-bold text-red-600">120 mm/jam</span>
                                </li>
                            </ul>
                        </div>

                        {/* Tombol Matikan Sirine */}
                        <button 
                            onClick={() => setShowModal(false)}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span className="text-xl">🔕</span> Matikan Sirine & Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}