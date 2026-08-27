"use client";
import { useState, useEffect } from "react";

interface LahanAren {
  _id: string;
  nama_lahan: string;
  jumlah_bibit: number;
  survival_rate: number;
}

export default function MonitoringAren() {
  const [lahanList, setLahanList] = useState<LahanAren[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [editData, setEditData] = useState<LahanAren | null>(null);
  const [pesan, setPesan] = useState<{ type: 'sukses' | 'error', teks: string } | null>(null);

  // Fungsi pura-pura (dummy) untuk testing UI sebelum API Sanity dibuat
  const fetchLahan = async () => {
    setIsLoadingData(true);
    try {
      // Nanti ini diganti dengan fetch betulan ke API Sanity kamu
      // const res = await fetch('/api/aren');
      // const result = await res.json();
      
      // Data Dummy (Simulasi Sanity)
      setTimeout(() => {
        setLahanList([
          { _id: '1', nama_lahan: 'Lahan 1', jumlah_bibit: 150, survival_rate: 85.5 },
          { _id: '2', nama_lahan: 'Lahan 2', jumlah_bibit: 200, survival_rate: 92.0 },
          { _id: '3', nama_lahan: 'Lahan 3', jumlah_bibit: 120, survival_rate: 78.4 },
        ]);
        setIsLoadingData(false);
      }, 800);
    } catch (error) {
      console.error("Gagal menarik data");
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchLahan();
  }, []);

  const openEditModal = (lahan: LahanAren) => {
    setEditData(lahan);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;
    setIsLoadingProcess(true);
    setPesan(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      id: editData._id,
      jumlah_bibit: Number(formData.get('jumlah_bibit')),
      survival_rate: Number(formData.get('survival_rate'))
    };

    try {
      // Nanti diganti dengan fetch PUT betulan ke API
      /*
      const response = await fetch('/api/aren', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      */
      
      // Simulasi sukses
      setTimeout(() => {
        setPesan({ type: 'sukses', teks: 'Data lahan berhasil diperbarui!' });
        setIsEditModalOpen(false);
        fetchLahan();
        setIsLoadingProcess(false);
      }, 1000);
      
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan sistem.' });
      setIsLoadingProcess(false);
    }
  };
  return (
    <main className="bg-gray-100 min-h-screen px-4 md:px-8 lg:px-10 py-10 font-sans">
        <div className="w-full mx-auto flex flex-col gap-2">
            <div>
                <h1 className="text-center md:text-start text-[28px] md:text-[32px] lg:text-[36px] font-black text-black uppercase tracking-wider">Monitoring Survival Rate Aren</h1>
                <p className="text-center md:text-start text-[12px] md:text-[16px] lg:text-[20px] text-gray-500">Pemantauan area konservasi pohon aren di desa</p>
            </div>

            {pesan && (
                <div className={`p-4 rounded-lg font-bold text-center shadow-sm ${pesan.type === 'sukses' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {pesan.teks}
                </div>
            )}
            
            {isLoadingData ? (
            <div className="p-10 text-center text-gray-500 font-bold animate-pulse">Menarik data lahan dari Sanity...</div>
            ) : (
            <div className="flex flex-col justify-between">
                {lahanList.map((lahan) => (
                    <div key={lahan._id} className="py-4 grid grid-cols-[4fr_1fr] overflow-hidden">
                        <div className="flex flex-col justify-between gap-2">
                            <h2 className="text-[20px] md:text-[24px] font-black text-[#936440] uppercase">{lahan.nama_lahan}</h2>
                            <div className="rounded-xl flex items-center gap-2">
                                <span className="text-sm md:text-base font-bold text-gray-500">Total Bibit Ditanam: </span>
                                <span className="text-lg md:text-xl font-black text-gray-800">{lahan.jumlah_bibit} Pohon</span>
                            </div>
                            <button onClick={() => openEditModal(lahan)} className="w-fit px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-bold text-sm transition-colors">
                                Edit survival rate {lahan.nama_lahan}
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 items-center">
                            <span className="text-xs md:text-sm text-center font-bold text-gray-500">Tingkat Keselamatan<br/> (Survival Rate)</span>
                            <div className="bg-green-50 w-[84px] h-[84px] rounded-full p-4 flex justify-center items-center">
                                <span className={`text-lg md:text-xl font-black ${lahan.survival_rate >= 80 ? 'text-green-600' : lahan.survival_rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {lahan.survival_rate}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>

        {isEditModalOpen && editData && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 md:p-8 overflow-y-auto w-full">
                <div className="flex justify-between leading-none items-center mb-6">
                    <h2 className="text-[20px] md:text-[24px] font-black text-[#0B592F] uppercase tracking-wider">Edit {editData.nama_lahan}</h2>
                    <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black font-bold text-[28px] hover:scale-110 active:scale-90">&times;</button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-5">
                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Bibit Saat Ini</label>
                    <div className="relative">
                        <input type="number" name="jumlah_bibit" required defaultValue={editData.jumlah_bibit} className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#936440] focus:ring-0 outline-none text-black font-mono text-lg font-bold"/>
                        <span className="absolute right-4 top-4 font-bold text-gray-400">Pohon</span>
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Survival Rate (%)</label>
                    <div className="relative">
                        <input type="number" step="any" name="survival_rate" required defaultValue={editData.survival_rate} className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#936440] focus:ring-0 outline-none text-black font-mono text-lg font-bold"/>
                        <span className="absolute right-4 top-4 font-bold text-gray-400">%</span>
                    </div>
                    </div>

                    <button type="submit" disabled={isLoadingProcess} className={`w-full py-4 mt-4 rounded-xl text-[14px] lg:text-[16px] text-white font-black uppercase tracking-widest cursor-pointer transition-all ${isLoadingProcess ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B592F] hover:bg-emerald-800 hover:shadow-lg active:scale-95'}`}>
                    {isLoadingProcess ? 'Menyimpan...' : 'Simpan Angka'}
                    </button>
                </form>
                </div>
            </div>
        </div>
        )}
    </main>
  );
}