"use client";
import Image from "next/image";
import Weather from "../components/weatherPrediction";
import NotificationManager from "../components/Notification";
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

// --- DATA DUMMY SESUAI INSTRUKSI ---
const sensorData = [
  { station: 'Kantor Desa', id: 'PD-001', water: 32, humidity: 68 },
  { station: 'Curug', id: 'PD-002', water: 58, humidity: 92 },
];

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
        
        {/* BAGIAN 1: PREDIKSI CUACA (Dari Komponen Aslimu) */}
        <section className="w-full drop-shadow-md">
            <Weather/>
        </section>

        {/* BAGIAN 2: PETA DAN DATA SENSOR (Grid 2 Kolom) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Kiri: Peta Lokasi */}
            <div className="flex flex-col bg-white rounded-xl shadow-lg border-2 border-[#936440]/60 overflow-hidden h-full">
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
                    <MapComponent />
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
                            <tr key={index} className="hover:bg-orange-50/30 transition-colors">
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

        {/* BAGIAN 3: BERITA BENCANA (Data Dummy) */}
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
      
      <NotificationManager/>
    </div>
  );
}