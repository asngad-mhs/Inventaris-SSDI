import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, X, RotateCcw, PenTool } from 'lucide-react';
import { InventarisItem, Kategori, Supplier } from '../types';

interface ItemFormProps {
  editingItem: InventarisItem | null;
  kategoris: Kategori[];
  suppliers: Supplier[];
  onSubmit: (item: Omit<InventarisItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancelEdit: () => void;
}

export default function ItemForm({
  editingItem,
  kategoris,
  suppliers,
  onSubmit,
  onCancelEdit
}: ItemFormProps) {
  const [nama, setNama] = useState('');
  const [kategoriId, setKategoriId] = useState<number>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [jumlah, setJumlah] = useState(1);
  const [minimalStok, setMinimalStok] = useState(3);
  const [kondisi, setKondisi] = useState<'Baik' | 'Rusak'>('Baik');
  const [lokasi, setLokasi] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Default first category on mount if available
  useEffect(() => {
    if (!editingItem && kategoris.length > 0 && !kategoriId) {
      setKategoriId(kategoris[0].id);
    }
  }, [kategoris, editingItem]);

  // Sync editing item
  const editingItemId = editingItem?.id || null;
  useEffect(() => {
    if (editingItem) {
      setNama(editingItem.nama);
      setKategoriId(editingItem.kategoriId);
      setSupplierId(editingItem.supplierId || '');
      setJumlah(editingItem.jumlah);
      setMinimalStok(editingItem.minimalStok || 3);
      setKondisi(editingItem.kondisi);
      setLokasi(editingItem.lokasi || '');
      setError(null);
    } else {
      resetForm();
    }
  }, [editingItemId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setError('Nama barang tidak boleh kosong!');
      return;
    }
    setError(null);
    onSubmit({
      nama: nama.trim(),
      kategoriId: Number(kategoriId) || (kategoris.length > 0 ? kategoris[0].id : 1),
      supplierId: supplierId ? Number(supplierId) : null,
      jumlah: isNaN(jumlah) || jumlah < 0 ? 0 : jumlah,
      minimalStok: isNaN(minimalStok) || minimalStok < 0 ? 3 : minimalStok,
      kondisi,
      lokasi: lokasi.trim()
    });
    if (!editingItem) {
      resetForm();
    }
  };

  const resetForm = () => {
    setNama('');
    setKategoriId(kategoris.length > 0 ? kategoris[0].id : '');
    setSupplierId('');
    setJumlah(1);
    setMinimalStok(3);
    setKondisi('Baik');
    setLokasi('');
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
              className={`ml-2 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                editingItem ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {editingItem ? 'Edit Mode' : 'Tambah'}
            </motion.span>
          </AnimatePresence>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Nama Barang */}
          <div className="flex flex-col gap-1">
            <label htmlFor="namaBarang" className="text-xs font-bold text-gray-500">Nama Barang *</label>
            <input
              type="text"
              id="namaBarang"
              placeholder="Contoh: Monitor 24 Inch"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>

          {/* Kategori Select */}
          <div className="flex flex-col gap-1">
            <label htmlFor="kategoriSelect" className="text-xs font-bold text-gray-500">Kategori Kelompok</label>
            <select
              id="kategoriSelect"
              value={kategoriId}
              onChange={(e) => setKategoriId(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            >
              {kategoris.map(k => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          {/* Supplier Select */}
          <div className="flex flex-col gap-1">
            <label htmlFor="supplierSelect" className="text-xs font-bold text-gray-500">Supplier (Pemasok)</label>
            <select
              id="supplierSelect"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value ? Number(e.target.value) : '')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            >
              <option value="">Tanpa Supplier</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>{s.nama}</option>
              ))}
            </select>
          </div>

          {/* Jumlah */}
          <div className="flex flex-col gap-1">
            <label htmlFor="jumlahBarang" className="text-xs font-bold text-gray-500">Jumlah Stok</label>
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

          {/* Minimal Stok Peringatan */}
          <div className="flex flex-col gap-1">
            <label htmlFor="minStokBarang" className="text-xs font-bold text-gray-500">Batas Stok Minimum</label>
            <input
              type="number"
              id="minStokBarang"
              placeholder="3"
              min="0"
              value={minimalStok}
              onChange={(e) => setMinimalStok(parseInt(e.target.value) || 0)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>

          {/* Kondisi */}
          <div className="flex flex-col gap-1">
            <label htmlFor="kondisiBarang" className="text-xs font-bold text-gray-500">Kondisi Fisik</label>
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

          {/* Lokasi Gudang */}
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="lokasiBarang" className="text-xs font-bold text-gray-500">Lokasi Rak / Gudang Penyimpanan</label>
            <input
              type="text"
              id="lokasiBarang"
              placeholder="Contoh: Gudang Barat - Rak C4"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
            />
          </div>
        </div>

        {error && (
          <p id="form-error-msg" className="text-xs font-semibold text-rose-650 block transition-all">
            ❌ {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            id="simpanBtn"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition duration-205 cursor-pointer font-bold"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Barang</span>
          </button>

          {editingItem && (
            <button
              type="button"
              id="batalEditBtn"
              onClick={onCancelEdit}
              className="bg-gray-400 hover:bg-gray-500 active:scale-95 text-white text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-1.5 transition duration-205 cursor-pointer font-bold"
            >
              <X className="w-4 h-4" />
              <span>Batal Edit</span>
            </button>
          )}

          <button
            type="button"
            id="resetFormBtn"
            onClick={resetForm}
            className="border border-gray-300 bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-xs px-4 py-2.5 rounded-lg transition duration-205 cursor-pointer flex items-center gap-1.5 font-semibold"
          >
            <RotateCcw className="w-4 h-4 text-gray-500" />
            <span>Reset Form</span>
          </button>
        </div>
      </form>
      <p className="text-[10px] text-gray-400 mt-2.5">* Nama barang wajib diisi untuk menyimpan data ke database SSDI.</p>
    </div>
  );
}
