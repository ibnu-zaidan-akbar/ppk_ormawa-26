'use client'
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex flex-col justify-center text-center lg:text-left leading-tight">
          <h1 className="text-white text-[20px] lg:text-[24px] font-bold">JAGAWARA ARENTA</h1>
          <h3 className="text-white text-[20px] lg:text-[24px] font-extrabold"><span className="text-blue-500">Admin</span> Dashboard</h3>
        </div>
        
        {/* Info User di Sidebar */}
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 leading-snug">
          <p className="text-[12px] text-slate-400 uppercase tracking-wider font-bold mb-1">Status Akses:</p>
          <p className="text-[14px] font-medium truncate text-blue-300">Terverifikasi</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          <Link href="/admin" className="block py-3 px-4 rounded transition duration-200 bg-blue-600 shadow-md font-semibold active:scale-90">
            Dashboard Admin
          </Link>
          <Link href="/admin/kelola-berita" className="block py-3 px-4 rounded transition duration-200 bg-blue-600 shadow-md font-semibold active:scale-90">
            Kelola Histori Bencana
          </Link>
          <Link href="/admin/export-data" className="block py-3 px-4 rounded transition duration-200 bg-blue-600 shadow-md font-semibold active:scale-90">
            Export Data
          </Link>
          <a href="#" className="block py-3 px-4 rounded transition duration-200 hover:bg-slate-800 text-slate-300">
            Status Perangkat IoT
          </a>
          <a href="#" className="block py-3 px-4 rounded transition duration-200 hover:bg-slate-800 text-slate-300">
            Manajemen Notifikasi
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer active:scale-90">
            Logout Sistem
          </button>
        </div>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pantauan Alat Sensor</h1>
            <p className="text-gray-500 mt-1">Monitoring kondisi lapangan secara real-time</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm">
            Koneksi Server: <span className="text-green-500 font-bold ml-1">● Online</span>
          </div>
        </header>

        {/* --- KARTU INDIKATOR SENSOR --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Sensor Curah Hujan */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sensor Curah Hujan</h3>
            <p className="text-4xl font-black text-gray-800 mt-3">12 <span className="text-lg text-gray-500 font-medium">mm/jam</span></p>
            <div className="mt-4 flex items-center text-sm">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Status: Normal</span>
            </div>
          </div>

          {/* Kelembapan Tanah */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kelembapan Tanah</h3>
            <p className="text-4xl font-black text-gray-800 mt-3">85 <span className="text-lg text-gray-500 font-medium">%</span></p>
            <div className="mt-4 flex items-center text-sm">
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">Status: Cukup Basah</span>
            </div>
          </div>

          {/* Pergerakan Tanah (Tilt/Gyroskop) */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pergerakan Tanah</h3>
            <p className="text-4xl font-black text-gray-800 mt-3">0.1 <span className="text-lg text-gray-500 font-medium">Derajat</span></p>
            <div className="mt-4 flex items-center text-sm">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Status: Stabil</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Getaran (Vibration)</h3>
            <p className="text-4xl font-black text-gray-800 mt-3">0.0 <span className="text-lg text-gray-500 font-medium">Hz</span></p>
            <div className="mt-4 flex items-center text-sm">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Status: Aman</span>
            </div>
          </div>
        </div>

        {/* --- TABEL RIWAYAT NOTIFIKASI --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Log Pengiriman Peringatan (PWA)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider bg-white">
                  <th className="px-6 py-4 font-semibold">Waktu Pengiriman</th>
                  <th className="px-6 py-4 font-semibold">Kategori Peringatan</th>
                  <th className="px-6 py-4 font-semibold">Target Penerima</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">14 Mar 2026, 19:30 WIB</td>
                  <td className="px-6 py-4 text-yellow-600 font-semibold">Cuaca Ekstrem (Hujan Deras)</td>
                  <td className="px-6 py-4">Semua Warga</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Terkirim</span></td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">12 Mar 2026, 08:15 WIB</td>
                  <td className="px-6 py-4 text-blue-600 font-semibold">Uji Coba Sistem Push</td>
                  <td className="px-6 py-4">Admin Only</td>
                  <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Terkirim</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}