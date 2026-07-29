"use client";
import Image from "next/image";
import Weather from "../components/weatherPrediction";
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/EquipmentMap'), { 
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">Memuat Peta...</div>
});

const status = [
    {id: 1, name: "Normal", color: "bg-[#8CA70A]"},
    {id: 2, name: "Siaga", color: "bg-[#DF6F3B]"},
    {id: 3, name: "Waspada", color: "bg-[#EEB627]"},
    {id: 4, name: "Awas", color: "bg-[#FF1100]"}
];

// --- DATA DUMMY SENSOR TERBARU ---
const sensorData = [
  { 
    station: 'Kantor Desa', 
    id: 'PD-001', 
    status: 'Normal',
    statusColor: 'bg-[#8CA70A]', 
    battery: 85, 
    batteryStatus: 'Discharge', 
    rain: '0 mm/jam', 
    soilMoisture: 45, 
    tilt: '0.1°', 
    vibration: '0.01 g' 
  },
  { 
    station: 'Curug', 
    id: 'PD-002', 
    status: 'Siaga',
    statusColor: 'bg-[#DF6F3B]', 
    battery: 42, 
    batteryStatus: 'Charge', 
    rain: '12 mm/jam', 
    soilMoisture: 78, 
    tilt: '1.2°', 
    vibration: '0.05 g' 
  },
];

// --- DATA DUMMY BERITA BENCANA ---
const newsHistory = [
  { 
    id: 1, 
    img: '/longsor-cipelah.jpg', 
    text: 'Telah terjadi longsor di tebing pemukiman warga Desa Cipelah akibat hujan deras yang mengguyur sejak semalam. Warga dihimbau untuk tetap waspada dan menjauhi area tebing.' 
  },
  { 
    id: 2, 
    img: '/longsor-desa-cipelah.jpg', 
    text: 'Tim relawan dan perangkat desa sedang melakukan pendataan dan evakuasi terhadap rumah-rumah yang terdampak material longsor. Jalur evakuasi sementara telah disiapkan di balai desa.' 
  },
];

export default function Home() {
  return (
    <div className="bg-[#f4f1ea] min-h-screen pb-16 font-sans">
      
      {/* HEADER UTAMA */}
      <div className="sticky top-0 z-50 p-2 lg:py-4 lg:px-8 bg-white w-full h-fit shadow-md border-b-[4px] border-[#0B592F] items-center flex justify-between lg:justify-start lg:gap-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-1">
          <Image src="/icon/mountain.svg" alt="icon" fill className="object-contain" />
        </div>
        <div className="flex flex-col justify-center text-center lg:text-left leading-tight order-2 lg:order-3">
          <h1 className="text-[#0B592F] text-[20px] lg:text-[28px] font-bold tracking-tight">JAGAWARA ARENTA</h1>
          <h3 className="text-[#936440] text-[12px] lg:text-[14px] font-semibold">Weather & Soil Sensor Dashboard</h3>
        </div>
        <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 relative items-center order-3 lg:order-2">
          <Image src="/icon/CloudRain.svg" alt="icon" fill className="object-contain" />
        </div>
      </div>

      <main className="max-w-[1480px] mx-auto px-4 md:px-10 xl:px-8 mt-8 space-y-8">
        
        {/* BAGIAN 1: PREDIKSI CUACA */}
        <section className="w-full drop-shadow-md">
            <Weather/>
        </section>

        {/* BAGIAN 2: DATA SENSOR & PETA (Posisi Atas-Bawah) */}
        <section className="flex flex-col gap-8 w-full">
            
            {/* ATAS: Tabel Data Sensor Lengkap */}
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden">
                <div className="p-4 border-b border-[#936440]/20 bg-gray-50/50">
                    <span className="text-[20px] font-bold text-[#0B592F] leading-tight block">Equipment Sensor Data</span>
                    <span className="text-[14px] text-[#936440] leading-tight">Live monitoring data status</span>
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
                            <tr key={index} className="hover:bg-orange-50/50 transition-colors">
                                {/* Titik */}
                                <td className="py-4 px-4 font-bold text-[#0B592F]">{data.station}</td>
                                {/* ID */}
                                <td className="py-4 px-4 text-gray-500 font-medium">{data.id}</td>
                                {/* Status (Badge) */}
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wider uppercase ${data.statusColor}`}>
                                        {data.status}
                                    </span>
                                </td>
                                {/* Baterai (Progress Bar) */}
                                <td className="py-4 px-4 min-w-[120px]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${data.battery > 50 ? 'bg-[#8CA70A]' : 'bg-red-500'}`} style={{ width: `${data.battery}%` }}></div>
                                        </div>
                                        <span className="text-xs font-bold text-gray-700 w-8">{data.battery}%</span>
                                    </div>
                                </td>
                                {/* Status Baterai (Teks Charge/Discharge) */}
                                <td className="py-4 px-4 font-bold text-[#936440]">{data.batteryStatus}</td>
                                {/* Curah Hujan */}
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.rain}</td>
                                {/* Kelembapan Tanah (Hanya Teks Persen) */}
                                <td className="py-4 px-4 font-bold text-[#DF6F3B]">{data.soilMoisture}%</td>
                                {/* Kemiringan */}
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.tilt}</td>
                                {/* Getaran */}
                                <td className="py-4 px-4 font-semibold text-gray-700">{data.vibration}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* BAWAH: Peta Lokasi (Bug Fix Scroll Diterapkan) */}
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60">
                <div className="flex justify-between p-4 items-center border-b border-[#936440]/20 bg-gray-50/50 rounded-t-xl">
                    <div className="flex flex-col">
                        <span className="text-[20px] font-bold text-[#0B592F] leading-tight">Equipment Map</span>
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
                {/* overflow-hidden dan rounded-b-xl dipindah ke sini */}
                <div className="w-full h-[450px] relative z-0 rounded-b-xl overflow-hidden">
                    <MapComponent />
                </div>
            </div>

        </section>

        {/* BAGIAN 3: BERITA BENCANA */}
        <section className="w-full mt-12 bg-white/50 p-6 rounded-xl border-2 border-[#936440]/30 shadow-sm">
          <h2 className="text-[24px] font-bold text-[#0B592F] mb-6 border-b-2 border-[#0B592F] inline-block pb-1">Berita Bencana Terbaru</h2>
          <div className="space-y-8">
            {newsHistory.map((news) => (
              <div key={news.id} className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-[350px] h-[200px] relative shrink-0 rounded-lg overflow-hidden border-2 border-[#936440]/20 shadow-md">
                    <Image 
                        src={news.img} 
                        alt="Berita Bencana" 
                        fill 
                        className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                </div>
                <p className="text-[15px] text-gray-700 leading-relaxed text-justify flex-1 font-medium">
                  {news.text}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}