"use client";
import { useState, useEffect } from "react";
import { createClient } from '@/src/utils/client';
import Image from "next/image";

interface HealthStatus {
  supabase: 'checking' | 'online' | 'error';
  sanity: 'checking' | 'online' | 'error';
  openMeteo: 'checking' | 'online' | 'error';
  leaflet: 'checking' | 'online' | 'error';
  dataCenter: 'checking' | 'online' | 'warning' | 'error'; 
}

interface TitikSensor {
  id: string;
  node_id: string;
  kategori: string;
  nama_lokasi: string;
  latitude: number;
  longitude: number;
}

interface AdminUser {
  id?: string;
  email: string;
  role: 'super_admin' | 'admin' | 'pending';
}

export default function MasterDashboard() {
  const supabase = createClient();

  // State untuk Hak Akses (Block 3 Visibility)
  const [currentUserRole, setCurrentUserRole] = useState<'super_admin' | 'admin' | 'pending' | null>(null);

  // State Data
  const [health, setHealth] = useState<HealthStatus>({
    supabase: 'checking', sanity: 'checking', openMeteo: 'checking', leaflet: 'checking', dataCenter: 'checking'
  });
  const [titikList, setTitikList] = useState<TitikSensor[]>([]);
  const [adminList, setAdminList] = useState<AdminUser[]>([]);

  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [pesanGlobal, setPesanGlobal] = useState<{ type: 'sukses' | 'error', teks: string } | null>(null);

  const [isTitikModalOpen, setIsTitikModalOpen] = useState(false);
  const [isDeleteTitikModalOpen, setIsDeleteTitikModalOpen] = useState(false);
  const [editTitik, setEditTitik] = useState<TitikSensor | null>(null);
  const [titikToDelete, setTitikToDelete] = useState<TitikSensor | null>(null);
  const [selectedKategori, setSelectedKategori] = useState('EWS');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionAdmin, setActionAdmin] = useState<{ email: string, action: 'acc' | 'reject' | 'revoke' } | null>(null);

  useEffect(() => {
    checkUserRole();
    runHealthChecks();
    fetchTitikSensor();
    fetchAdminList();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { data } = await supabase.from('admin_roles').select('role').eq('email', user.email).single();
      if (data) setCurrentUserRole(data.role);
    }
  };

  const runHealthChecks = async () => {
    const { error: supError } = await supabase.from('admin_roles').select('id').limit(1);
    setHealth(prev => ({ ...prev, supabase: supError ? 'error' : 'online' }));

    try {
      const meteoRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-7.0&longitude=109.0&current_weather=true');
      setHealth(prev => ({ ...prev, openMeteo: meteoRes.ok ? 'online' : 'error' }));
    } catch { setHealth(prev => ({ ...prev, openMeteo: 'error' })); }

    try {
      const leafRes = await fetch('https://tile.openstreetmap.org/0/0/0.png', { mode: 'no-cors' });
      setHealth(prev => ({ ...prev, leaflet: 'online' }));
    } catch { setHealth(prev => ({ ...prev, leaflet: 'error' })); }

    try {
      const sanityRes = await fetch('/api/berita');
      setHealth(prev => ({ ...prev, sanity: sanityRes.ok ? 'online' : 'error' }));
    } catch { setHealth(prev => ({ ...prev, sanity: 'error' })); }

    // E. Cek Data Center Desa (Heartbeat) -> LOGIKA DUMMY, nanti disesuaikan dengan tabel sensor-mu
    // Asumsi: Ambil data sensor terakhir. Jika > 30 menit, error. Jika > 10 menit, warning.
    try {
      // DUMMY: const { data } = await supabase.from('tabel_sensor_mu').select('created_at').order('created_at', { ascending: false }).limit(1);
      // Simulasi berhasil untuk sekarang:
      setTimeout(() => setHealth(prev => ({ ...prev, dataCenter: 'online' })), 1500);
    } catch { setHealth(prev => ({ ...prev, dataCenter: 'error' })); }
  };

  const fetchTitikSensor = async () => {
    try {
      const res = await fetch('/api/koordinat', { cache: 'no-store' });
      const result = await res.json();
      if (res.ok) setTitikList(result.data);
    } catch (error) {
      console.error("Gagal menarik data titik koordinat");
    }
  };

  const openAddTitikModal = () => {
    setEditTitik(null);
    setSelectedKategori('EWS');
    setIsTitikModalOpen(true);
  };

  const openEditTitikModal = (titik: TitikSensor) => {
    setEditTitik(titik);
    setSelectedKategori(titik.kategori);
    setIsTitikModalOpen(true);
  };

  const openDeleteTitikModal = (titik: TitikSensor) => {
    setTitikToDelete(titik);
    setIsDeleteTitikModalOpen(true);
  };

  const handleTitikSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoadingProcess(true);
    setPesanGlobal(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      id: editTitik?.id,
      node_id: formData.get('node_id') || '',
      kategori: formData.get('kategori'),
      nama_lokasi: formData.get('nama_lokasi'),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
    };

    const method = editTitik ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/koordinat', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (res.ok) {
        setPesanGlobal({ type: 'sukses', teks: result.message });
        setIsTitikModalOpen(false);
        fetchTitikSensor();
      } else {
        setPesanGlobal({ type: 'error', teks: result.message || 'Gagal menyimpan data.' });
      }
    } catch (error) {
      setPesanGlobal({ type: 'error', teks: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsLoadingProcess(false);
    }
  };

  const confirmDeleteTitik = async () => {
    if (!titikToDelete) return;
    setIsLoadingProcess(true);
    setPesanGlobal(null);

    try {
      const res = await fetch(`/api/koordinat?id=${titikToDelete.id}`, { method: 'DELETE' });
      const result = await res.json();

      if (res.ok) {
        setPesanGlobal({ type: 'sukses', teks: result.message });
        fetchTitikSensor();
      } else {
        setPesanGlobal({ type: 'error', teks: result.message || 'Gagal menghapus.' });
      }
    } catch (error) {
      setPesanGlobal({ type: 'error', teks: 'Terjadi kesalahan sistem.' });
    } finally {
      setIsLoadingProcess(false);
      setIsDeleteTitikModalOpen(false);
      setTitikToDelete(null);
    }
  };

  const fetchAdminList = async () => {
    try{
      const res = await fetch('/api/admin/roles', { cache: 'no-store' });
      const result = await res.json();
      if (res.ok){
        setAdminList(result.data);
      }
    } catch (error){
      console.error("Gagal menarik data pengguna admin");
    }
  };

  const handleAdminAction = (email: string, action: 'acc' | 'reject' | 'revoke') => {
    setActionAdmin({ email, action });
    setIsConfirmModalOpen(true);
  };

  const confirmAdminAction = async () => {
    if (!actionAdmin) return;
    setIsLoadingProcess(true);
    setPesanGlobal(null);

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionAdmin)
      });
      const result = await res.json();

      if (res.ok) {
        setPesanGlobal({ type: 'sukses', teks: result.message });
        fetchAdminList();
      } else {
        setPesanGlobal({ type: 'error', teks: result.message || 'Gagal mengeksekusi.' });
      }
    } catch (error) {
      setPesanGlobal({ type: 'error', teks: 'Terjadi kesalahan sistem saat memproses akses.' });
    } finally {
      setIsLoadingProcess(false);
      setIsConfirmModalOpen(false);
      setActionAdmin(null);
    }
  };

  const StatusDot = ({ status }: { status: string }) => {
    const colors = {
      checking: 'bg-gray-400 animate-pulse',
      online: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]',
      warning: 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]',
      error: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse'
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`}></div>;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-10 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        <section className="flex flex-col justify-between gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h1 className="text-[28px] md:text-[36px] font-black text-black uppercase tracking-wider">Master Control Panel</h1>
              <p className="text-gray-500 font-medium">Pusat kendali infrastruktur IoT dan sistem informasi EWS Desa.</p>
            </div>
            <div className="flex gap-4">
              <Image src="/logo_kab_bandung.png" alt="logo kabupaten bandung" width={100} height={40} className=""/>
              <Image src="/logo_ppko_iaas.png" alt="logo kabupaten bandung" width={90} height={40} className=""/>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Status Infrastruktur 
              <button onClick={runHealthChecks} className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-gray-600 transition-colors">Refresh</button>
            </h2>
            <div className="flex gap-4">
              
              <div className="bg-white py-2 px-4 gap-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] font-black text-blue-500/60 uppercase">Data Center</span>
                  <p className="text-[14px] font-bold text-gray-700">Aktivitas Sensor</p>
                </div>
                <StatusDot status={health.dataCenter} />
              </div>

              <div className="bg-white py-2 px-4 gap-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] font-black text-blue-500/60 uppercase">Supabase Server</span>
                  <p className="text-[14px] font-bold text-gray-700">Database & Autentikasi</p>
                </div>
                <StatusDot status={health.supabase} />
              </div>

              <div className="bg-white py-2 px-4 gap-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] font-black text-blue-500/60 uppercase">Sanity CMS</span>
                  <p className="text-[14px] font-bold text-gray-700">Manajemen Berita</p>
                </div>
                <StatusDot status={health.sanity} />
              </div>

              <div className="bg-white py-2 px-4 gap-8 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] font-black text-blue-500/60 uppercase">Open-Meteo</span>
                  <p className="text-[14px] font-bold text-gray-700">Server Cuaca</p>
                </div>
                <StatusDot status={health.openMeteo} />
              </div>

              <div className="bg-white py-2 px-4 gap-8  rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-[16px] font-black text-blue-500/60 uppercase">Leaflet Map</span>
                  <p className="text-[14px] font-bold text-gray-700">Server Peta</p>
                </div>
                <StatusDot status={health.leaflet} />
              </div>

            </div>
          </div>
        </section>

        {pesanGlobal && (
          <div className={`p-4 rounded-lg font-bold text-center shadow-sm ${pesanGlobal.type === 'sukses' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {pesanGlobal.teks}
          </div>
        )}

        <section>
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Kelola Koordinat Sensor</h2>
              <p className="text-sm text-gray-500">Pemetaan node_id perangkat keras ke koordinat peta spasial.</p>
            </div>
            <button onClick={openAddTitikModal} className="bg-[#0B592F] hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm">
              + Tambah Titik
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[#936440] text-xs uppercase tracking-wider">
                    <th className="p-4 font-black">Kategori</th>
                    <th className="p-4 font-black">Node ID</th>
                    <th className="p-4 font-black">Nama Lokasi / Tiang</th>
                    <th className="p-4 font-black">Latitude</th>
                    <th className="p-4 font-black">Longitude</th>
                    <th className="p-4 font-black text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {titikList.map((titik) => (
                    <tr key={titik.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold">
                          <span className={`px-2 py-1 text-xs rounded-md ${
                              titik.kategori === 'EWS' ? 'bg-red-100 text-red-700' :
                              titik.kategori === 'POSKO' ? 'bg-blue-100 text-blue-700' : 
                              titik.kategori === 'KESEHATAN' ? 'bg-green-100 text-green-700' :
                              titik.kategori === 'RAWAN LONGSOR' ? 'bg-amber-100 text-[#8B4513]' :
                              'bg-gray-100 text-gray-700'}`}>
                            {titik.kategori}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-gray-600">{titik.node_id || '-'}</td>
                      <td className="p-4 font-semibold text-gray-800">{titik.nama_lokasi}</td>
                      <td className="p-4 font-mono text-gray-600">{titik.latitude}</td>
                      <td className="p-4 font-mono text-gray-600">{titik.longitude}</td>
                      <td className="p-4 flex justify-center gap-2">
                          <button onClick={() => openEditTitikModal(titik)} className="px-3 py-1 bg-amber-100 text-amber-700 rounded font-bold text-xs hover:bg-amber-200">Edit</button>
                          <button onClick={() => openDeleteTitikModal(titik)} className="px-3 py-1 bg-red-100 text-red-700 rounded font-bold text-xs hover:bg-red-200">Hapus</button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {currentUserRole === 'super_admin' && (
          <section className="border-t-2 border-[#936440]/20 pt-8 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-1">Hak Akses Sistem</h2>
            <p className="text-sm text-gray-500 mb-6">Manajemen persetujuan dan pencabutan akses perangkat desa.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-[#0B592F] overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Daftar Admin Aktif</h3>
                </div>
                <div className="p-4 space-y-3">
                  {adminList.filter(a => a.role !== 'pending').map(admin => (
                    <div key={admin.email} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{admin.email}</p>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {admin.role.replace('_', ' ')}
                        </span>
                      </div>
                      {admin.role !== 'super_admin' && (
                        <button onClick={() => handleAdminAction(admin.email, 'revoke')} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 font-bold px-3 py-1.5 rounded">Cabut Akses</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg border-t-4 border-yellow-500 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Menunggu Persetujuan (Pending)</h3>
                </div>
                <div className="p-4 space-y-3">
                  {adminList.filter(a => a.role === 'pending').map(admin => (
                    <div key={admin.email} className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                      <span className="text-sm font-semibold text-gray-700">{admin.email}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleAdminAction(admin.email, 'acc')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md shadow-sm" title="Setujui">✔️</button>
                        <button onClick={() => handleAdminAction(admin.email, 'reject')} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-sm" title="Tolak">❌</button>
                      </div>
                    </div>
                  ))}
                  {adminList.filter(a => a.role === 'pending').length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">Tidak ada antrean saat ini.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {isTitikModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-2 border-[#936440]/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] md:text-[24px] font-black text-[#0B592F] uppercase tracking-wider">
                {editTitik ? 'Edit Titik Peta' : 'Tambah Titik Peta'}
              </h2>
              <button onClick={() => setIsTitikModalOpen(false)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleTitikSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Kategori Titik</label>
                <select 
                  name="kategori" 
                  value={selectedKategori} 
                  onChange={(e) => setSelectedKategori(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 outline-none font-semibold text-gray-800"
                >
                  <option value="EWS">🚨 Tiang Sensor (EWS)</option>
                  <option value="POSKO">⛺ Posko Aman</option>
                  <option value="KESEHATAN">🏥 Fasilitas Kesehatan</option>
                  <option value="RAWAN LONGSOR">⚠️ Zona Rawan Longsor</option>
                </select>
              </div>

              {selectedKategori === 'EWS' && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <label className="block text-sm font-bold text-red-700 mb-1">ID Hardware (Node ID) <span className="text-red-500">*</span></label>
                  <input type="text" name="node_id" required defaultValue={editTitik?.node_id || ''} placeholder="Contoh: EWS_01" className="w-full p-3 rounded-lg border border-red-300 outline-none text-black font-mono uppercase"/>
                  <p className="text-xs text-red-600 mt-1 italic">Wajib unik dan sesuai dengan kodingan pada alat mikrokontroler.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lokasi</label>
                <input type="text" name="nama_lokasi" required defaultValue={editTitik?.nama_lokasi || ''} placeholder="Contoh: Lereng Utama" className="w-full p-3 rounded-lg border border-gray-300 outline-none text-black"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Latitude</label>
                  <input type="number" step="any" name="latitude" required defaultValue={editTitik?.latitude || ''} placeholder="-7.xxx" className="w-full p-3 rounded-lg border border-gray-300 outline-none text-black font-mono"/>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Longitude</label>
                  <input type="number" step="any" name="longitude" required defaultValue={editTitik?.longitude || ''} placeholder="109.xxx" className="w-full p-3 rounded-lg border border-gray-300 outline-none text-black font-mono"/>
                </div>
              </div>

              <button type="submit" disabled={isLoadingProcess} className="w-full py-4 rounded-xl text-white font-black uppercase tracking-widest mt-4 bg-[#0B592F] hover:bg-emerald-800 disabled:opacity-50">
                {isLoadingProcess ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteTitikModalOpen && titikToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-t-4 border-red-500 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
            <h2 className="text-xl md:text-2xl font-black text-gray-800 mb-2">Hapus Titik {titikToDelete.kategori}?</h2>
            <p className="text-gray-500 mb-6 text-sm">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-gray-800">{titikToDelete.nama_lokasi}</span>?
              {titikToDelete.kategori === 'EWS' && (
                <span className="block mt-2 text-red-500 font-semibold bg-red-50 p-2 rounded">
                  Catatan: Jika alat ini sudah pernah merekam data sensor, penghapusan akan ditolak oleh sistem keamanan.
                </span>
              )}
            </p>
            <div className="flex flex-col-reverse md:flex-row gap-3 justify-center">
              <button onClick={() => { setIsDeleteTitikModalOpen(false); setTitikToDelete(null); }} disabled={isLoadingProcess} className="w-full px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                Batal
              </button>
              <button onClick={confirmDeleteTitik} disabled={isLoadingProcess} className="w-full px-6 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg">
                {isLoadingProcess ? 'Mengecek...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmModalOpen && actionAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-t-4 text-center ${actionAdmin.action === 'acc' ? 'border-green-500' : 'border-red-500'}`}>
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl ${actionAdmin.action === 'acc' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
              {actionAdmin.action === 'acc' ? '✅' : '⚠️'}
            </div>
            
            <h2 className="text-xl font-black text-gray-800 mb-2">
              {actionAdmin.action === 'acc' ? 'Setujui Akses Admin?' : actionAdmin.action === 'reject' ? 'Tolak & Hapus Akun?' : 'Cabut Akses Admin?'}
            </h2>
            
            <p className="text-gray-500 mb-8 text-sm">
              Tindakan ini akan {actionAdmin.action === 'acc' ? 'memberikan hak kelola EWS kepada' : 'menghapus hak akses sistem untuk'} email: <br/>
              <span className="font-bold text-gray-900 mt-2 block">{actionAdmin.email}</span>
            </p>

            <div className="flex gap-3 justify-center">
              <button onClick={() => setIsConfirmModalOpen(false)} className="w-full px-4 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Batal</button>
              <button onClick={confirmAdminAction} className={`w-full px-4 py-3 rounded-xl font-bold text-white shadow-lg ${actionAdmin.action === 'acc' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {isLoadingProcess ? 'Memproses...' : 'Ya, Eksekusi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}