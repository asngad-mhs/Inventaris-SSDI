import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Plus, Edit, Trash2, Check, X, Users2 } from 'lucide-react';
import { Supplier, InventarisItem } from '../types';

interface SupplierViewProps {
  suppliers: Supplier[];
  inventaris: InventarisItem[];
  onAdd: (sup: Omit<Supplier, 'id'>) => void;
  onEdit: (id: number, sup: Omit<Supplier, 'id'>) => void;
  onDelete: (id: number) => void;
}

export default function SupplierView({
  suppliers,
  inventaris,
  onAdd,
  onEdit,
  onDelete
}: SupplierViewProps) {
  const [editingItem, setEditingItem] = useState<Supplier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleEditInit = (s: Supplier) => {
    setEditingItem(s);
    setNama(s.nama);
    setKontak(s.kontak);
    setTelepon(s.telepon);
    setEmail(s.email);
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleCreateInit = () => {
    setEditingItem(null);
    setNama('');
    setKontak('');
    setTelepon('');
    setEmail('');
    setIsFormOpen(true);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setErrorMsg('Nama supplier tidak boleh kosong!');
      return;
    }

    const payload = {
      nama: nama.trim(),
      kontak: kontak.trim(),
      telepon: telepon.trim(),
      email: email.trim()
    };

    if (editingItem) {
      onEdit(editingItem.id, payload);
    } else {
      onAdd(payload);
    }

    setIsFormOpen(false);
    setEditingItem(null);
    setNama('');
    setKontak('');
    setTelepon('');
    setEmail('');
    setErrorMsg(null);
  };

  const handleDelete = (id: number, namaSup: string) => {
    if (window.confirm(`Hapus supplier "${namaSup}"? Data barang yang menggunakan supplier ini akan dilepaskan.`)) {
      onDelete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
            <Truck className="w-5 h-5 text-indigo-600" />
            <span>Manajemen Supplier (Pemasok)</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Konfigurasi distributor, agen, atau mitra penyedia barang inventaris.</p>
        </div>
        {!isFormOpen && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateInit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Supplier</span>
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
                <span>✏️</span> {editingItem ? 'Edit Supplier' : 'Supplier Baru'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="space-y-1">
                  <label htmlFor="supNama" className="block text-xs font-bold text-slate-500">Nama Toko / Perusahaan*</label>
                  <input
                    type="text"
                    id="supNama"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: PT Elco Tech"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="supKontak" className="block text-xs font-bold text-slate-500">Nama Kontak (Sales)</label>
                  <input
                    type="text"
                    id="supKontak"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="supTelp" className="block text-xs font-bold text-slate-500">No. Telepon / HP</label>
                  <input
                    type="text"
                    id="supTelp"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    placeholder="Contoh: 0812345678"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="supEmail" className="block text-xs font-bold text-slate-500">Alamat Email</label>
                  <input
                    type="email"
                    id="supEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Contoh: sales@elco.com"
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
                  <span>Simpan Supplier</span>
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

      {/* Suppliers Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-slate-600 font-semibold">
              <tr className="text-left">
                <th className="px-5 py-3 w-12 text-center">No</th>
                <th className="px-5 py-3">Nama Perusahaan</th>
                <th className="px-5 py-3">Sales / Kontak</th>
                <th className="px-5 py-3">Telepon</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3 text-center w-36">Jumlah Supply</th>
                <th className="px-5 py-3 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-450 bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <Users2 className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-400 text-xs">Belum ada Supplier terdaftar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                suppliers.map((s, idx) => {
                  const itemsSupplied = inventaris.filter(i => i.supplierId === s.id).length;
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">
                        {s.nama}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">
                        {s.kontak || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono text-xs font-semibold">
                        {s.telepon || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs font-medium">
                        {s.email || '-'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="inline-flex bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold font-mono border">
                          {itemsSupplied} jenis
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditInit(s)}
                            className="inline-flex items-center gap-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.nama)}
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
