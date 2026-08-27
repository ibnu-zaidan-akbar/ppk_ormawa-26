"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface SensorData {
  id_log: string;
  waktu: string;
  station: string;
  id_alat: string;
  status: string;
  battery: number;
  rain: string;
  soilMoisture: number;
  tilt: string;
  vibration: string;
}

export default function MonitoringSensorAdmin() {
  const [dataSensor, setDataSensor] = useState<SensorData[]>([]);
  const [waktuRefresh, setWaktuRefresh] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [selectedEWS, setSelectedEWS] = useState<string>("Semua");

  const fetchSensorData = async () => {
    setIsLoading(true);
    
    // Inisialisasi koneksi ke Supabase
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Logika: Ambil data terbaru di 1 menit terakhir
    const satuMenitLalu = new Date(Date.now() - 60000).toISOString();
    
    // 1. UBAH DI SINI: Ganti 'nama_tabel_kamu' dengan nama tabel asli di Supabase
    const { data, error } = await supabase
      .from('nama_tabel_kamu') // <--- GANTI NAMA TABELNYA DI SINI
      .select('*')
      .gte('created_at', satuMenitLalu) // Pastikan nama kolom tanggalnya 'created_at'
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Gagal menarik data dari Supabase:", error);
    }

    if (data) {
      const formattedData = data.map((item: any) => {
        
        // 2. UBAH DI SINI: Ganti 'node_id' dengan nama kolom ID EWS di Supabase-mu
        let namaLokasi = item.node_id; // <--- GANTI 'node_id'
        
        // Pastikan 'EWS_01' sesuai dengan isi datanya di Supabase
        if (namaLokasi === 'EWS_01') namaLokasi = 'EWS Pasirnangka';
        else if (namaLokasi === 'EWS_02') namaLokasi = 'EWS Cisabuk';
        else if (namaLokasi === 'EWS_03') namaLokasi = 'EWS Gunung Leutik';

        return {
          // 3. UBAH DI SINI: Cocokkan 'item.nama_kolom' dengan yang ada di Supabase
          id_log: item.id,                                // <--- Ganti 'id'
          waktu: new Date(item.created_at).toLocaleTimeString('id-ID'), // <--- Ganti 'created_at'
          station: namaLokasi,
          id_alat: item.node_id,                          // <--- Ganti 'node_id'
          status: item.status || 'Normal',                // <--- Ganti 'status'
          battery: item.baterai || 0,                     // <--- Ganti 'baterai'
          rain: `${item.curah_hujan || 0} mm/jam`,        // <--- Ganti 'curah_hujan'
          soilMoisture: item.kelembapan || 0,             // <--- Ganti 'kelembapan'
          tilt: `${item.kemiringan || 0}°`,               // <--- Ganti 'kemiringan'
          vibration: `${item.getaran || 0} g`             // <--- Ganti 'getaran'
        };
      });
      
      setDataSensor(formattedData);
    }

    setWaktuRefresh(new Date().toLocaleTimeString('id-ID'));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSensorData();
    const intervalId = setInterval(() => {
      fetchSensorData();
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredData = selectedEWS === "Semua" 
    ? dataSensor 
    : dataSensor.filter(data => data.id_alat === selectedEWS);

  const filterTabs = [
    { id: "Semua", label: "Semua Alat" },
    { id: "EWS_01", label: "EWS 1 (Pasirnangka)" },
    { id: "EWS_02", label: "EWS 2 (Cisabuk)" },
    { id: "EWS_03", label: "EWS 3 (Gunung Leutik)" },
  ];

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diexport pada filter ini");
      return;
    }

    const headers = ["Waktu", "Titik Lokasi", "ID Alat", "Status", "Baterai (%)", "Curah Hujan", "Kelembapan Tanah (%)", "Kemiringan", "Getaran"];
    
    const csvRows = [
      headers.join(","),
      ...filteredData.map(row => [
        row.waktu,
        row.station,
        row.id_alat,
        row.status,
        row.battery,
        row.rain.replace(" mm/jam", ""), 
        row.soilMoisture,
        row.tilt.replace("°", ""),
        row.vibration.replace(" g", "")
      ].join(","))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    
    const fileName = selectedEWS === "Semua" ? "Semua_EWS" : selectedEWS;
    
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans text-black">
      <div className="max-w-[1480px] mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-[24px] md:text-[28px] font-extrabold text-black uppercase tracking-tight">Monitoring Sensor</h1>
            <p className="text-gray-500 font-medium mt-1">
              Data ditarik otomatis setiap 1 menit. <span className="text-gray-400 text-sm">(Terakhir update: {waktuRefresh})</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={fetchSensorData}
              className="px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              {isLoading ? 'Memuat...' : 'Refresh Manual'}
            </button>
            <button 
              onClick={handleExportExcel}
              className="px-4 py-2 bg-[#0B592F] text-white font-bold rounded-lg hover:bg-[#0B592F]/90 shadow-sm transition-colors flex items-center gap-2"
            >
              Export ke Excel (CSV)
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          
          <div className="flex px-6 relative z-10 -mb-[1px]">
            {filterTabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setSelectedEWS(tab.id)}
                className={`px-6 py-3 font-bold text-sm border rounded-t-lg transition-colors whitespace-nowrap 
                  ${index > 0 ? "-ml-[1px]" : ""} 
                  ${
                  selectedEWS === tab.id
                    ? "bg-white border-gray-200 border-b-white text-black relative z-20" 
                    : "bg-gray-50 border-gray-200 border-b-transparent text-gray-500 hover:bg-gray-100 relative z-10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="border-b border-gray-200 bg-white">
                  <tr>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Waktu</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Titik Lokasi</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">ID Alat</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Baterai</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Curah Hujan</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Kelembapan</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Kemiringan</th>
                    <th className="py-5 px-6 font-bold text-[#936440] text-xs uppercase tracking-wider">Getaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-500 font-medium">{data.waktu}</td>
                      <td className="py-4 px-6 font-bold text-gray-800">{data.station}</td>
                      <td className="py-4 px-6 text-gray-500 font-medium">{data.id_alat}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`px-3 py-1.5 rounded-md text-white text-[11px] font-bold tracking-wider uppercase shadow-sm
                          ${data.status === 'Normal' ? 'bg-[#8CA70A]' : 
                            data.status === 'Siaga' ? 'bg-[#DF6F3B]' : 
                            data.status === 'Waspada' ? 'bg-[#EEB627]' : 'bg-[#FF1100]'}`}>
                          {data.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-700">{data.battery}%</td>
                      <td className="py-4 px-6 font-medium text-gray-700">{data.rain}</td>
                      <td className="py-4 px-6 font-bold text-gray-700">{data.soilMoisture}%</td>
                      <td className="py-4 px-6 font-medium text-gray-700">{data.tilt}</td>
                      <td className="py-4 px-6 font-medium text-gray-700">{data.vibration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredData.length === 0 && !isLoading && (
                <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center justify-center">
                  <span className="text-4xl mb-3">📭</span>
                  Belum ada data terekam untuk {selectedEWS === "Semua" ? "semua alat" : `alat ${selectedEWS}`}.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}