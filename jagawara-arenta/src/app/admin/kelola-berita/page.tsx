"use client";
import { useState, useEffect } from "react";

interface FotoSanity {
  key: string;
  ref: string;
  url: string;
}

interface Berita {
  _id: string;
  judul: string;
  tahun: number;
  deskripsi: string;
  galeri_foto: FotoSanity[];
}

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  
  const [editData, setEditData] = useState<Berita | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<FotoSanity[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [pesan, setPesan] = useState<{ type: 'sukses' | 'error', teks: string } | null>(null);

  const fetchBerita = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch('/api/berita', {
        cache: 'no-store'
      });
      const result = await response.json();
      if (response.ok) setBeritaList(result.data);
    } catch (error) {
      console.error("Gagal menarik data");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    fetchBerita();
  }, []);

  async function handleAddSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoadingProcess(true);
    setPesan(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch('/api/berita', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setPesan({ type: 'sukses', teks: 'Berita berhasil diterbitkan!' });
        setIsAddModalOpen(false);
        fetchBerita();
      } else {
        setPesan({ type: 'error', teks: 'Gagal menerbitkan berita.' });
      }
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsLoadingProcess(false);
    }
  }

  const openEditModal = (berita: Berita) => {
    setEditData(berita);
    setExistingPhotos(berita.galeri_foto || []);
    setIsEditModalOpen(true);
  };

  const handleRemoveExistingPhoto = (keyToRemove: string) => {
    setExistingPhotos((prev) => prev.filter(foto => foto.key !== keyToRemove));
  };

  async function handleEditSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      const response = await fetch('/api/berita', { method: 'PUT', body: formData });
      if (response.ok) {
        setPesan({ type: 'sukses', teks: 'Berita berhasil diperbarui!' });
        setIsEditModalOpen(false);
        fetchBerita();
      } else {
        setPesan({ type: 'error', teks: 'Gagal memperbarui berita.' });
      }
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsLoadingProcess(false);
    }
  }

  const openDeleteModal = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  async function handleDelete() {
    if (!itemToDelete) return;
    setIsLoadingProcess(true);
    setPesan(null);
    try {
      const response = await fetch(`/api/berita?id=${itemToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setPesan({ type: 'sukses', teks: 'Berita berhasil dihapus!' });
        fetchBerita();
      } else {
        setPesan({ type: 'error', teks: 'Gagal menghapus.' });
      }
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan saat menghapus.' });
    } finally {
      setIsLoadingProcess(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 md:px-8 lg:px-10 py-10 font-sans">
      <div className="w-full mx-auto flex flex-col gap-2">
        <div>
          <h1 className="text-center md:text-start text-[28px] md:text-[32px] lg:text-[36px] font-black text-black uppercase tracking-wider">Kelola Histori Bencana</h1>
          <p className="text-center md:text-start text-[12px] md:text-[16px] lg:text-[20px] text-gray-500">Manajemen arsip kejadian untuk sistem informasi desa.</p>
        </div>

        <button onClick={() => setIsAddModalOpen(true)} className="bg-[#0B592F] hover:bg-emerald-800 w-fit text-[12px] md:text-[14px] lg:text-[16px] text-white font-bold mt-4 py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
          + Tambah Catatan Baru
        </button>

        {pesan && (
          <div className={`p-4 mb-6 rounded-lg font-bold text-center shadow-sm ${pesan.type === 'sukses' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {pesan.teks}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {isLoadingData ? (
            <div className="p-10 text-center text-gray-500 font-bold animate-pulse">Mengambil data dari Sanity...</div>
          ) : beritaList.length === 0 ? (
            <div className="p-10 text-center text-gray-500">Belum ada catatan histori bencana.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="">
                  <tr className="bg-gray-50 text-[#936440] text-sm uppercase tracking-wider">
                    <th className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-black">Tahun</th>
                    <th className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-black">Judul Kejadian</th>
                    <th className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-black w-1/3">Deskripsi Singkat</th>
                    <th className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                  {beritaList.map((item) => (
                    <tr key={item._id} className="border-t border-[#936440] hover:bg-gray-50 transition-colors">
                      <td className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-bold">{item.tahun}</td>
                      <td className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 font-semibold text-black">{item.judul}</td>
                      <td className="text-center text-[12px] md:text-[14px] lg:text-[16px] py-2 px-4 md:p-4 truncate max-w-xs">{item.deskripsi}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => openEditModal(item)} className="px-3 py-1 text-[12px] md:text-[14px] lg:text-[16px] bg-amber-100 text-amber-700 hover:bg-amber-200 rounded font-bold">Edit</button>
                        <button onClick={() => openDeleteModal(item._id)} className="px-3 py-1 text-[12px] md:text-[14px] lg:text-[16px] bg-red-100 text-red-700 hover:bg-red-200 rounded font-bold">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-black text-black text-center uppercase tracking-wider">Input Histori Baru</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-black font-bold text-[28px] lg:text-[36px] hover:scale-110 active:scale-90">&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-gray-700 mb-1">Judul Kejadian</label>
                <input type="text" name="judul" required placeholder="Contoh: Longsor di Tebing Desa Cipelah" className="w-full p-2 lg:px-4 lg:py-3 text-black text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-black"/>
              </div>
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-gray-700 mb-1">Tahun Kejadian</label>
                <input type="number" name="tahun" required defaultValue={new Date().getFullYear()} className="w-full p-2 lg:px-4 lg:py-3 text-black text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-black"/>
              </div>
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-gray-700 mb-1">Deskripsi Lengkap</label>
                <textarea name="deskripsi" required placeholder="Ceritakan detail kejadian secara lengkap..." className="w-full p-2 lg:px-4 lg:py-3 text-black text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] rounded-lg border border-gray-300 min-h-[100px] focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-black"></textarea>
              </div>
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-gray-700 mb-1">Unggah Foto (Bisa lebih dari 1)</label>
                <input type="file" name="foto" accept="image/*" multiple required className="w-full text-black text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 bg-gray-50 file:mr-4 file:p-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] md:file:text-[12px] lg:file:text-[14px] file:font-bold file:bg-[#0B592F]/90 file:text-white file:cursor-pointer hover:file:bg-[#0B592F] transition-all text-gray-600 cursor-pointer"/>
                <p className="text-[10px] md:text-[12px] text-[#936440] mt-1 italic">Note : Tahan tombol CTRL untuk memilih banyak foto di folder.</p>
              </div>
              <button type="submit" disabled={isLoadingProcess} className={`w-full py-3 md:py-4 text-[12px] md:text-[14px] lg:text-[16px] rounded-xl text-white font-black uppercase tracking-widest md:mt-2 transition-all duration-300 cursor-pointer ${isLoadingProcess ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B592F]/90 hover:bg-[#0B592F] hover:shadow-lg active:scale-95'}`}>
                {isLoadingProcess ? 'Menyimpan...' : 'Terbitkan Berita'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between leading-none items-center mb-4">
              <h2 className="text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] font-black text-black uppercase tracking-wider">Edit Catatan</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black font-bold text-[28px] lg:text-[36px] hover:scale-110 active:scale-90">&times;</button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-black mb-1">Judul Kejadian</label>
                <input type="text" name="judul" required defaultValue={editData.judul} placeholder="contoh: Longsor" className="w-full p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-gray-700 text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px]"/>
              </div>
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-black mb-1">Tahun Kejadian</label>
                <input type="number" name="tahun" required defaultValue={editData.tahun} className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-gray-700 text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px]"/>
              </div>
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-black mb-1">Deskripsi Lengkap</label>
                <textarea name="deskripsi" required defaultValue={editData.deskripsi} className="w-full p-3 rounded-lg border border-gray-300 min-h-[100px] focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-gray-700 text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px]"></textarea>
              </div>
              
              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-black mb-2">Foto Saat Ini</label>
                {existingPhotos.length > 0 ? (
                  <div className="flex gap-4 flex-wrap bg-gray-50 p-2 md:p-3 lg:p-4 rounded-xl border border-gray-200">
                    {existingPhotos.map((foto) => (
                      <div key={foto.key} className="relative group">
                        <img src={foto.url} alt="Foto Bencana" className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36 object-cover rounded-lg shadow-sm border border-gray-300" />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveExistingPhoto(foto.key)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow-md hover:bg-red-700 transition-transform hover:scale-110"
                          title="Hapus foto ini"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[8px] md:text-[10px] lg:text-[12px] xl:text-[14px] -mt-2 text-red-500 italic">Semua foto lama telah dihapus. Wajib tambahkan foto baru di bawah.</p>
                )}
              </div>

              <div>
                <label className="block text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px] font-bold text-black mb-1">Tambah Foto Baru (Opsional)</label>
                <input type="file" name="newFoto" accept="image/*" multiple className="w-full text-[11px] md:text-[13px] lg:text-[15px] xl:text-[17px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 bg-gray-50 file:mr-4 file:p-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] md:file:text-[12px] lg:file:text-[14px] file:font-bold file:bg-amber-600 file:text-white file:cursor-pointer transition-all text-gray-600 cursor-pointer "/>
              </div>
              
              <button type="submit" disabled={isLoadingProcess} className={`w-full py-3 md:py-4 rounded-xl text-[12px] md:text-[14px] lg:text-[16px] text-white font-black uppercase tracking-widest md:mt-2 cursor-pointer ${isLoadingProcess ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 hover:shadow-lg active:scale-95'}`}>
                {isLoadingProcess ? 'Memperbarui...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-2xl border-b-4 border-r-4 border-red-700 text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-red-200 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-[24px] md:text-[28px] lg:text-[32px]">⚠️</div>
            <h2 className="text-[18px] md:text-[20px] lg:text-[24px] font-black text-black mb-2 leading-tight">Hapus Catatan?</h2>
            <p className="text-gray-700 mb-4 text-[12px] md:text-[14px] lg:text-[16px]">Apakah Anda yakin ingin menghapus berita ini secara permanen?</p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button onClick={() => {setIsDeleteModalOpen(false); setItemToDelete(null);}} disabled={isLoadingProcess} className="w-full px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer">
                Batal
              </button>
              <button onClick={handleDelete} disabled={isLoadingProcess} className="w-full px-6 py-3 rounded-xl font-bold text-white bg-red-700 hover:bg-red-800 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50 cursor-pointer">
                {isLoadingProcess ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}