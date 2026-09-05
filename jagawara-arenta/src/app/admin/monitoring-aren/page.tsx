"use client";
import { useState, useEffect } from "react";

interface FotoSanity {
  key: string;
  ref: string;
  url: string;
}

interface LahanAren {
  _id: string;
  nama_lahan: string;
  jumlah_bibit: number;
  survival_rate: number;
  foto_lahan: FotoSanity[];
}

export default function MonitoringAren() {
  const [lahanList, setLahanList] = useState<LahanAren[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [editData, setEditData] = useState<LahanAren | null>(null);

  const [existingPhotos, setExistingPhotos] = useState<FotoSanity[]>([]);
  const [pesan, setPesan] = useState<{ type: 'sukses' | 'error', teks: string } | null>(null);

  const fetchLahan = async () => {
    setIsLoadingData(true);
    try {
      const res = await fetch('/api/aren', { cache: 'no-store' });
      const result = await res.json();
      
      if (res.ok) {
        setLahanList(result.data);
      }
    } catch (error) {
      console.error("Gagal menarik data dari API");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchLahan();
  }, []);

  const openEditModal = (lahan: LahanAren) => {
    setEditData(lahan);
    setExistingPhotos(lahan.foto_lahan || []);
    setIsEditModalOpen(true);
  };

  const handleRemoveExistingPhoto = (keyToRemove: string) => {
    setExistingPhotos((prev) => prev.filter(foto => foto.key !== keyToRemove));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;
    setIsLoadingProcess(true);
    setPesan(null);

    const formData = new FormData(e.currentTarget);
    formData.append('id', editData._id);

    const sanityFormattedExisting = existingPhotos.map(p => ({
      _key: p.key,
      _type: 'image',
      asset: { _type: 'reference', _ref: p.ref }
    }));
    formData.append('existingPhotos', JSON.stringify(sanityFormattedExisting));

    try {
      const response = await fetch('/api/aren', {
        method: 'PUT',
        body: formData
      });
      
      if (response.ok) {
        setPesan({ type: 'sukses', teks: 'Data lahan & foto berhasil diperbarui!' });
        setIsEditModalOpen(false);
        fetchLahan();
      } else {
        setPesan({ type: 'error', teks: 'Gagal memperbarui data lahan.' });
      }
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan sistem jaringan.' });
    } finally {
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
            <div className="flex flex-col gap-4 mt-4">
              {lahanList.map((lahan) => (
                <div key={lahan._id} className="py-6 px-4 md:px-6 bg-white rounded-2xl shadow-md border-l-8 border-[#0B592F] grid grid-cols-1 md:grid-cols-[4fr_1fr] gap-6 overflow-hidden">
                    <div className="flex flex-col justify-between gap-4">
                      <div>
                        <h2 className="text-[20px] md:text-[24px] font-black text-[#936440] uppercase mb-1">{lahan.nama_lahan}</h2>
                        {lahan.foto_lahan && lahan.foto_lahan.length > 0 ? (
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                {lahan.foto_lahan.map((foto) => (
                                    <img key={foto.key} src={foto.url} alt="Lahan" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-200 shadow-sm"/>
                                ))}
                            </div>
                        ) : (
                            <span className="text-xs italic text-gray-400">Belum ada foto dokumentasi</span>
                        )}
                      </div>

                      <div className="rounded-xl flex items-center gap-2 bg-gray-50 p-3 border border-gray-100 w-fit">
                          <span className="text-sm md:text-base font-bold text-gray-500">Total Bibit Ditanam: </span>
                          <span className="text-lg md:text-xl font-black text-gray-800">{lahan.jumlah_bibit} Pohon</span>
                      </div>
                          
                      <button onClick={() => openEditModal(lahan)} className="w-fit px-5 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-bold text-sm transition-colors mt-2">
                          Edit Data Lahan
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 items-center justify-center p-4 rounded-xl">
                        <span className="text-xs md:text-sm text-center font-bold text-gray-500">Tingkat Keselamatan<br/> (Survival Rate)</span>
                        <div className="bg-green-50 w-[96px] h-[96px] rounded-full p-4 flex justify-center items-center shadow-inner border border-green-100">
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
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                <div className="p-6 md:p-8 overflow-y-auto w-full">
                    <div className="flex justify-between leading-none items-center mb-6">
                        <h2 className="text-[20px] md:text-[24px] font-black text-[#0B592F] uppercase tracking-wider">Edit {editData.nama_lahan}</h2>
                        <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black font-bold text-[28px] hover:scale-110 active:scale-90">&times;</button>
                    </div>

                    <form onSubmit={handleEditSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Bibit Saat Ini</label>
                                <div className="relative">
                                    <input type="number" name="jumlah_bibit" required defaultValue={editData.jumlah_bibit} className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#936440] focus:ring-0 outline-none text-black font-mono text-lg font-bold"/>
                                    <span className="absolute right-10 top-4 font-bold text-gray-400">Pohon</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Survival Rate (%)</label>
                                <div className="relative">
                                    <input type="number" step="any" name="survival_rate" required defaultValue={editData.survival_rate} className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-[#936440] focus:ring-0 outline-none text-black font-mono text-lg font-bold"/>
                                    <span className="absolute right-10 top-4 font-bold text-gray-400">%</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Foto Dokumentasi Saat Ini</label>
                            {existingPhotos.length > 0 ? (
                                <div className="flex gap-4 flex-wrap bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    {existingPhotos.map((foto) => (
                                        <div key={foto.key} className="relative group">
                                            <img src={foto.url} alt="Foto Lahan" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-gray-300" />
                                            <button 
                                                type="button" 
                                                onClick={() => handleRemoveExistingPhoto(foto.key)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md hover:bg-red-700 transition-transform hover:scale-110"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-red-500 italic">Belum ada foto / foto lama telah dihapus.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tambah Foto Baru (Opsional)</label>
                            <input type="file" name="newFoto" accept="image/*" multiple className="w-full text-sm p-3 rounded-xl border border-gray-300 bg-gray-50 file:mr-4 file:p-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#936440] file:text-white file:cursor-pointer transition-all text-gray-600 cursor-pointer"/>
                        </div>

                        <button type="submit" disabled={isLoadingProcess} className={`w-full py-4 mt-4 rounded-xl text-[14px] lg:text-[16px] text-white font-black uppercase tracking-widest cursor-pointer transition-all ${isLoadingProcess ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B592F] hover:bg-emerald-800 hover:shadow-lg active:scale-95'}`}>
                          {isLoadingProcess ? 'Menyimpan ke Sanity...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
        )}
    </main>
  );
}