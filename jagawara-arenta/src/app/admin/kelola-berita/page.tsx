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
  fotoList: FotoSanity[];
}

export default function AdminBeritaPage() {
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  
  const [editData, setEditData] = useState<Berita | null>(null);
  const [existingPhotos, setExistingPhotos] = useState<FotoSanity[]>([]);
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
    setExistingPhotos(berita.fotoList || []);
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

  async function handleDelete(id: string) {
    if (!window.confirm("Yakin ingin menghapus catatan ini?")) return;
    setPesan(null);
    try {
      const response = await fetch(`/api/berita?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPesan({ type: 'sukses', teks: 'Berita dihapus!' });
        fetchBerita();
      } else {
        setPesan({ type: 'error', teks: 'Gagal menghapus.' });
      }
    } catch (error) {
      setPesan({ type: 'error', teks: 'Terjadi kesalahan.' });
    }
  }

  return (
    <div className="bg-[#f4f1ea] min-h-screen px-6 md:px-10 xl:px-8 py-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl border-2 border-[#936440]/60">
        <h1 className="text-[20px] md:text-[28px] lg:text-[32px] font-black text-[#0B592F] text-center uppercase tracking-wider">Input Histori Bencana</h1>
        <p className="text-[12px] md:text-[14px] lg:text-[16px] text-[#936440] text-center mb-4">Formulir Redaksi untuk Menambah Catatan ke Sistem Informasi Desa.</p>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] md:text-[12px] lg:text-[14px] font-bold text-gray-700 mb-1">Judul Berita / Kejadian</label>
            <input type="text" name="judul" required placeholder="Contoh: Longsor di Tebing Desa Cipelah" className="w-full text-[10px] md:text-[12px] lg:text-[14px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-black"/>
          </div>

          <div>
            <label className="block text-[10px] md:text-[12px] lg:text-[14px] font-bold text-gray-700 mb-1">Tahun Kejadian</label>
            <input type="number" name="tahun" required defaultValue={new Date().getFullYear()} className="w-full text-[10px] md:text-[12px] lg:text-[14px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 transition-all outline-none text-black"/>
          </div>

          <div>
            <label className="block text-[10px] md:text-[12px] lg:text-[14px] font-bold text-gray-700 mb-1">Kronologi / Deskripsi Lengkap</label>
            <textarea name="deskripsi" required placeholder="Ceritakan detail kejadian secara lengkap..." className="w-full text-[10px] md:text-[12px] lg:text-[14px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 focus:border-[#936440] focus:ring-2 focus:ring-[#936440]/30 min-h-[80px] md:min-h-[100px] lg:min-h-[120px] transition-all outline-none resize-none text-black"></textarea>
          </div>

          <div>
            <label className="block text-[10px] md:text-[12px] lg:text-[14px] font-bold text-gray-700 mb-1">Unggah Foto (Bisa lebih dari 1)</label>
            <input type="file" name="foto" accept="image/*" multiple required className="w-full text-[10px] md:text-[12px] lg:text-[14px] p-2 lg:px-4 lg:py-3 rounded-lg border border-gray-300 bg-gray-50 file:mr-4 file:p-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] md:file:text-[12px] lg:file:text-[14px] file:font-bold file:bg-[#0B592F]/90 file:text-white hover:file:bg-[#0B592F] transition-all text-gray-600 cursor-pointer"/>
            <p className="text-[10px] md:text-[12px] text-[#936440] mt-1 italic">Note : Tahan tombol CTRL untuk memilih banyak foto di folder.</p>
          </div>

          <button type="submit" disabled={isLoadingProcess}
            className={`w-full py-4 text-[12px] md:text-[14px] lg:text-[16px] rounded-xl text-white font-black uppercase tracking-widest transition-all duration-300 cursor-pointer ${isLoadingProcess ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0B592F]/90 hover:bg-[#0B592F] hover:shadow-lg active:scale-95'}`}
          >
            {isLoadingProcess ? 'Sedang Menyimpan...' : 'Terbitkan Berita'}
          </button>
        </form>
        {pesan && (
          <div className={`p-4 mb-6 rounded-lg font-bold text-center ${pesan.type === 'sukses' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{pesan.teks}</div>
        )}
      </div>
    </div>
  );
}