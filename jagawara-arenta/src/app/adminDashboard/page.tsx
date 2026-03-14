'use client'
import { useState, useEffect } from 'react';

// DAFTAR EMAIL YANG DIIZINKAN (Whitelist)
// Nanti kamu bisa tambah email relawan desa di sini
const ALLOWED_EMAILS = [
  "admin@desa.com", 
  "kamu@gmail.com"
];

export default function AdminDashboard() {
  const [emailInput, setEmailInput] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [status, setStatus] = useState("checking"); // checking | authenticated | pending | no_email

  // 1. Mengecek memori browser saat halaman pertama kali dibuka
  useEffect(() => {
    const memoriBrowser = localStorage.getItem("admin_email");
    if (memoriBrowser) {
      setSavedEmail(memoriBrowser);
      // Cek apakah email di memori ada di daftar izin
      if (ALLOWED_EMAILS.includes(memoriBrowser)) {
        setStatus("authenticated");
      } else {
        setStatus("pending");
      }
    } else {
      setStatus("no_email");
    }
  }, []);

  // 2. Fungsi saat tombol "Request Akses" ditekan
  const handleRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailInput) return;
    
    localStorage.setItem("admin_email", emailInput);
    setSavedEmail(emailInput);
    
    // Cek langsung apakah email yang baru dimasukkan itu valid
    if (ALLOWED_EMAILS.includes(emailInput)) {
      setStatus("authenticated");
    } else {
      setStatus("pending");
    }
  };

  // 3. Fungsi Logout (Menghapus memori browser)
  const handleLogout = () => {
    localStorage.removeItem("admin_email");
    setSavedEmail("");
    setEmailInput("");
    setStatus("no_email");
  };

  // ==========================================
  // TAMPILAN 1: LOADING (Saat mengecek memori)
  // ==========================================
  if (status === "checking") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-xl font-bold text-gray-500 animate-pulse">Memuat Sistem EWS...</div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 2: FORM REQUEST AKSES (Belum ada email)
  // ==========================================
  if (status === "no_email") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-2">EWS Admin</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">Masukkan email untuk meminta akses ke dashboard pemantauan bencana.</p>
          
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <input 
                type="email" 
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="relawan@desa.com"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
            >
              Request Akses
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 3: MENUNGGU PERSETUJUAN (Email tidak terdaftar)
  // ==========================================
  if (status === "pending") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100 font-sans p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-yellow-500 text-center">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⏳
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Akses Tertunda</h2>
          <p className="text-gray-600 mb-6">
            Email <span className="font-bold text-gray-900">{savedEmail}</span> sedang menunggu persetujuan dari Super Admin. Silakan hubungi admin untuk di-whitelist.
          </p>
          <button 
            onClick={handleLogout}
            className="text-blue-600 hover:text-blue-800 font-semibold underline text-sm"
          >
            Gunakan email lain
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN 4: DASHBOARD UTAMA (Email terdaftar & Valid)
  // ==========================================
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR NAVIGASI --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 text-2xl font-extrabold border-b border-slate-800 tracking-wider">
          EWS<span className="text-blue-500">Admin</span>
        </div>
        
        {/* Info User di Sidebar */}
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Login sebagai:</p>
          <p className="text-sm font-medium truncate text-blue-300">{savedEmail}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          <a href="#" className="block py-3 px-4 rounded transition duration-200 bg-blue-600 shadow-md font-semibold">
            Dashboard Utama
          </a>
          <a href="#" className="block py-3 px-4 rounded transition duration-200 hover:bg-slate-800 text-slate-300">
            Status Perangkat IoT
          </a>
          <a href="#" className="block py-3 px-4 rounded transition duration-200 hover:bg-slate-800 text-slate-300">
            Peta Rawan Bencana
          </a>
          <a href="#" className="block py-3 px-4 rounded transition duration-200 hover:bg-slate-800 text-slate-300">
            Manajemen Notifikasi
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          {/* Tombol Logout dipasang fungsi handleLogout */}
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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