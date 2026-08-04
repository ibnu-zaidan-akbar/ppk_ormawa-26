'use client'
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <main className="flex-1 p-8 h-screen bg-gray-100 font-sans overflow-y-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pantauan Alat Sensor</h1>
          <p className="text-gray-500 mt-1">Monitoring kondisi lapangan secara real-time</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm">
          Koneksi Server: <span className="text-green-500 font-bold ml-1">● Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Sensor Curah Hujan</h3>
          <p className="text-4xl font-black text-gray-800 mt-3">12 <span className="text-lg text-gray-500 font-medium">mm/jam</span></p>
          <div className="mt-4 flex items-center text-sm">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">Status: Normal</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kelembapan Tanah</h3>
          <p className="text-4xl font-black text-gray-800 mt-3">85 <span className="text-lg text-gray-500 font-medium">%</span></p>
          <div className="mt-4 flex items-center text-sm">
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">Status: Cukup Basah</span>
          </div>
        </div>

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
  );
}