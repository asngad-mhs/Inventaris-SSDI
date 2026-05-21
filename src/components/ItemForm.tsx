import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, X, RotateCcw, PenTool } from 'lucide-react';
import { InventarisItem } from '../types';

interface ItemFormProps {
  editingItem: InventarisItem | null;
  onSubmit: (item: Omit<InventarisItem, 'id'>) => void;
  onCancelEdit: () => void;
}

export default function ItemForm({ editingItem, onSubmit, onCancelEdit }: ItemFormProps) {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState('');
  const [jumlah, setJumlah] = useState(1);
  const [kondisi, setKondisi] = useState<'Baik' | 'Rusak'>('Baik');
  const [error, setError] = useState<string | null>(null);

  // Sync editing item
  const editingItemId = editingItem?.id || null;
  useEffect(() => {
    if (editingItem) {
      setNama(editingItem.nama);
      setKategori(editingItem.kategori);
      setJumlah(editingItem.jumlah);
      setKondisi(editingItem.kondisi);
      setError(null);
    } else {
      resetForm();
    }
  }, [editingItemId]); // Listening to primitive ID is optimized and safe!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama barang tidak boleh kosong!');
      return;
    }
    setError(null);
    onSubmit({
      nama: nama.trim(),
      kategori: kategori.trim() || 'Umum',
      jumlah: isNaN(jumlah) || jumlah < 0 ? 0 : jumlah,
      kondisi
    });
    if (!editingItem) {
      resetForm();
    }
  };

  const resetForm = () => {
    setNama('');
    setKategori('');
    setJumlah(1);
    setKondisi('Baik');
    setError(null);
  };

  return (
    <div id="form-barang-container" className="bg-gray-50 rounded-xl p-4 md:p-5 mb-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800 flex items-center gap-1.5 text-base sm:text-lg">
          <PenTool className="w-5 h-5 text-indigo-600" />
          <span>Form Barang</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={editingItem ? 'edit' : 'tambah'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                editingItem ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {editingItem ? 'Edit Mode' : 'Tambah'}
            </motion.span>
          </AnimatePresence>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Nama Barang */}
          <div className="flex flex-col gap-1">
            <label htmlFor="namaBarang" className="text-xs font-semibold text-gray-500">Nama Barang *</label>
            <input
              type="text"
              id="namaBarang"
              placeholder="Contoh: Monitor 24 Inch"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>

          {/* Kategori */}
          <div className="flex flex-col gap-1">
            <label htmlFor="kategoriBarang" className="text-xs font-semibold text-gray-500">Kategori</label>
            <input
              type="text"
              id="kategoriBarang"
              placeholder="Contoh: Elektronik"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>

          {/* Jumlah */}
          <div className="flex flex-col gap-1">
            <label htmlFor="jumlahBarang" className="text-xs font-semibold text-gray-500">Jumlah Stok</label>
            <input
              type="number"
              id="jumlahBarang"
              placeholder="Jumlah"
              min="0"
              value={jumlah}
              onChange={(e) => setJumlah(parseInt(e.target.value) || 0)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-1">
            <label htmlFor="kondisiBarang" className="text-xs font-semibold text-gray-500">Kondisi</label>
            <select
              id="kondisiBarang"
              value={kondisi}
              onChange={(e) => setKondisi(e.target.value as 'Baik' | 'Rusak')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            >
              <option value="Baik">✅ Baik</option>
              <option value="Rusak">⚠️ Rusak</option>
            </select>
          </div>
        </div>

        {error && (
          <p id="form-error-msg" className="text-xs font-semibold text-rose-600 block transition-all">
            ❌ {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            id="simpanBtn"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition duration-200 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Barang</span>
          </button>

          {editingItem && (
            <button
              type="button"
              id="batalEditBtn"
              onClick={onCancelEdit}
              className="bg-gray-400 hover:bg-gray-500 active:scale-95 text-white text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition duration-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Batal Edit</span>
            </button>
          )}

          <button
            type="button"
            id="resetFormBtn"
            onClick={resetForm}
            className="border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-sm px-4 py-2.5 rounded-lg transition duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span>Reset Form</span>
          </button>
        </div>
      </form>
      <p className="text-[10px] text-gray-400 mt-2.5">* Nama barang wajib diisi untuk menyimpan data.</p>
    </div>
  );
}
