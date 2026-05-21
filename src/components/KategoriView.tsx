import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Plus, Edit, Trash2, Check, X, ClipboardList } from 'lucide-react';
import { Kategori, InventarisItem } from '../types';

interface KategoriViewProps {
  kategoris: Kategori[];
  inventaris: InventarisItem[];
  onAdd: (kat: Omit<Kategori, 'id'>) => void;
  onEdit: (id: number, kat: Omit<Kategori, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function KategoriView({
  kategoris,
  inventaris,
  onAdd,
  onEdit,
  onDelete
}: KategoriViewProps) {
  const [editingItem, setEditingItem] = useState<Kategori | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEditInit = (k: Kategori) => {
    setEditingItem(k);
    setNama(k.nama);
    setDeskripsi(k.deskripsi);
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleCreateInit = () => {
    setEditingItem(null);
    setNama('');
    setDeskripsi('');
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong!');
      return;
    }

    if (editingItem) {
      onEdit(editingItem.id, { nama: nama.trim(), deskripsi: deskripsi.trim() });
    } else {
      onAdd({ nama: nama.trim(), deskripsi: deskripsi.trim() });
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setNama('');
    setDeskripsi('');
    setErrorMsg(null);
  };

  const handleDelete = (id: number, namaKat: string) => {
    if (window.confirm(`Hapus kategori "${namaKat}"? Barang yang memiliki kategori ini akan dialihkan ke kategori umum.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
            <Tag className="w-5 h-5 text-indigo-600" />
            <span>Manajemen Kategori Barang</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Tambah, edit, dan hapus rumpun atau kategori pengelompokkan barang.</p>
        </div>
        {!isFormOpen && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateInit}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kategori</span>
          </motion.button>
        )}
      </div>

      {/* Slide-down form for add / edit */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 space-y-4 shadow-inner">
              <h3 className="font-extrabold text-slate-700 text-sm flex items-center gap-1.5">
                <span>✏️</span> {editingItem ? 'Edit Kategori' : 'Kategori Baru'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="katNama" className="block text-xs font-bold text-slate-500">Nama Kategori*</label>
                  <input
                    type="text"
                    id="katNama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Elektronik, Tools, Meja Kursi"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="katDesk" className="block text-xs font-bold text-slate-500">Deskripsi Singkat</label>
                  <input
                    type="text"
                    id="katDesk"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Contoh: Komputer, monitor, kabel jaringan"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
              </div>
              {errorMsg && <p className="text-xs text-rose-500 font-semibold">❌ {errorMsg}</p>}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Kategori</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 active:scale-95 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Batal</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-slate-600 font-semibold">
              <tr className="text-left">
                <th className="px-5 py-3 w-12 text-center">No</th>
                <th className="px-5 py-3">Nama Kategori</th>
                <th className="px-5 py-3">Deskripsi</th>
                <th className="px-5 py-3 text-center w-36">Alokasi Barang</th>
                <th className="px-5 py-3 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {kategoris.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-450 bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <ClipboardList className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-400 text-xs">Belum ada Kategori yang terdaftar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                kategoris.map((k, idx) => {
                  const allocations = inventaris.filter(i => i.kategoriId === k.id).length;
                  return (
                    <motion.tr
                      key={k.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {k.nama}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {k.deskripsi || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border">
                          {allocations} item
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditInit(k)}
                            className="inline-flex items-center gap-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(k.id, k.nama)}
                            className="inline-flex items-center gap-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
