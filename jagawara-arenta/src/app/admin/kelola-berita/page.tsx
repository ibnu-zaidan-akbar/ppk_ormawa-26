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
    <div className="bg-[#f4f1ea] min-h-screen px-4 md:px-8 lg:px-10 py-10 font-sans">
      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-center md:text-start text-[24px] md:text-[28px] lg:text-[32px] font-black text-[#0B592F] uppercase tracking-wider">Kelola Histori Bencana</h1>
            <p className="text-center md:text-start text-[12px] md:text-[14px] lg:text-[16px] text-[#936440]">Manajemen arsip kejadian untuk sistem informasi desa.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-[#0B592F] hover:bg-[#0B592F]/80 text-[12px] md:text-[14px] lg:text-[16px] text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer">
            + Tambah Catatan Baru
          </button>
        </div>

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
                    <th className="text-center p-4 font-black">Tahun</th>
                    <th className="text-center p-4 font-black">Judul Kejadian</th>
                    <th className="text-center p-4 font-black w-1/3">Deskripsi Singkat</th>
                    <th className="text-center p-4 font-black">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                  {beritaList.map((item) => (
                    <tr key={item._id} className="border-t border-[#936440] hover:bg-gray-50 transition-colors">
                      <td className="text-center p-4 font-bold">{item.tahun}</td>
                      <td className="text-center p-4 font-semibold text-black">{item.judul}</td>
                      <td className="text-center p-4 truncate max-w-xs">{item.deskripsi}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded font-bold">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded font-bold">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
}