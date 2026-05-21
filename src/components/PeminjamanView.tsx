import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HandHelping, Plus, Check, X, ClipboardList, Calendar, Trash2 } from 'lucide-react';
import { Peminjaman, InventarisItem, UserRole } from '../types';

interface PeminjamanViewProps {
  peminjamans: Peminjaman[];
  inventaris: InventarisItem[];
  role: UserRole;
  currentUsername: string;
  onPinjam: (p: Omit<Peminjaman, 'id' | 'userId' | 'tanggalPinjam' | 'tanggalRealKembali' | 'status'>) => void;
  onKembali: (id: number) => void;
  onDeletePinjam: (id: number) => void;
}

export default function PeminjamanView({
  peminjamans,
  inventaris,
  role,
  currentUsername,
  onPinjam,
  onKembali,
  onDeletePinjam
}: PeminjamanViewProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [barangId, setBarangId] = useState<number | ''>('');
  const [jumlah, setJumlah] = useState(1);
  const [tanggalKembali, setTanggalKembali] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter out loans for display:
  // Admin sees all loans, standard user sees only their own loans
  const displayedLoans = role === 'admin' 
    ? peminjamans 
    : peminjamans.filter(p => p.userId === currentUsername);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barangId) {
      setErrorMsg('Harap pilih barang terlebih dahulu!');
      return;
    }
    const item = inventaris.find(i => i.id === Number(barangId));
    if (!item) {
      setErrorMsg('Barang tidak ditemukan!');
      return;
    }
    if (jumlah <= 0) {
      setErrorMsg('Jumlah peminjaman harus lebih dari 0!');
      return;
    }
    if (jumlah > item.jumlah) {
      setErrorMsg(`Stok tidak mencukupi! Stok saat ini: ${item.jumlah}`);
      return;
    }
    if (!tanggalKembali) {
      setErrorMsg('Silakan pilih batas tanggal pengembalian!');
      return;
    }

    onPinjam({
      barangId: Number(barangId),
      jumlah,
      tanggalKembali
    });

    setIsFormOpen(false);
    setBarangId('');
    setJumlah(1);
    setTanggalKembali('');
    setErrorMsg(null);
  };

  const handleReturnAction = (id: number, barangNama: string, qty: number) => {
    if (window.confirm(`Konfirmasi pengembalian barang "${barangNama}" sebanyak ${qty} unit?`)) {
      onKembali(id);
    }
  };

  const handleDeleteAction = (id: number) => {
    if (window.confirm('Hapus log peminjaman ini secara permanen dari riwayat?')) {
      onDeletePinjam(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
            <HandHelping className="w-5 h-5 text-indigo-600" />
            <span>Peminjaman Alat &amp; Barang</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {role === 'admin' 
              ? 'Kelola semua antrean peminjaman aktif dan proses pengembalian.' 
              : 'Daftar peminjaman barang aktif Anda dan ajukan pinjaman baru.'}
          </p>
        </div>
        {!isFormOpen && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsFormOpen(true);
              setErrorMsg(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Pinjam Barang</span>
          </motion.button>
        )}
      </div>

      {/* Slide-down Form to Borrow */}
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
                <span>📝</span> Formulir Peminjaman Baru
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Select Barang */}
                <div className="space-y-1">
                  <label htmlFor="pinjamBarang" className="block text-xs font-bold text-slate-500">Pilih Barang*</label>
                  <select
                    id="pinjamBarang"
                    value={barangId}
                    onChange={(e) => setBarangId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  >
                    <option value="">-- Pilih Barang Baik --</option>
                    {inventaris
                      .filter(i => i.jumlah > 0 && i.kondisi === 'Baik')
                      .map(item => (
                        <option key={item.id} value={item.id}>
                          {item.nama} (Stok: {item.jumlah})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Jumlah */}
                <div className="space-y-1">
                  <label htmlFor="pinjamJumlah" className="block text-xs font-bold text-slate-500">Jumlah Unit Pinjam*</label>
                  <input
                    type="number"
                    id="pinjamJumlah"
                    min="1"
                    value={jumlah}
                    onChange={(e) => setJumlah(parseInt(e.target.value) || 1)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>

                {/* Tanggal Rencana Kembali */}
                <div className="space-y-1">
                  <label htmlFor="pinjamTgl" className="block text-xs font-bold text-slate-500">Tanggal Pengembalian*</label>
                  <input
                    type="date"
                    id="pinjamTgl"
                    value={tanggalKembali}
                    onChange={(e) => setTanggalKembali(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
                  />
                </div>
              </div>

              {errorMsg && <p className="text-xs text-rose-500 font-semibold" id="pinjam-error-msg">❌ {errorMsg}</p>}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer font-semibold transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Kirim Pengajuan</span>
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

      {/* List / Table of loans */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-slate-600 font-semibold">
              <tr className="text-left">
                <th className="px-5 py-3 w-12 text-center">No</th>
                <th className="px-5 py-3">Nama Alat / Barang</th>
                <th className="px-5 py-3">Dipinjam Oleh</th>
                <th className="px-5 py-3 text-right">Qty</th>
                <th className="px-5 py-3">Tgl Pinjam</th>
                <th className="px-5 py-3">Batas Kembali</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white animate-fade-in">
              {displayedLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-450 bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <ClipboardList className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-400 text-xs">Belum ada daftar peminjaman saat ini.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedLoans.map((p, idx) => {
                  const b = inventaris.find(item => item.id === p.barangId);
                  const isBorrowed = p.status === 'dipinjam';
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-center text-slate-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">
                        {b?.nama || `Barang ID: ${p.barangId} (Terhapus)`}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-600">
                        {p.userId === 'admin' ? '👑 Admin' : `👤 ${p.userId}`}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-800">
                        {p.jumlah}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {new Date(p.tanggalPinjam).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">
                        {new Date(p.tanggalKembali).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5">
                        {isBorrowed ? (
                          <span className="inline-flex bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            ⚠️ Dipinjam
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span className="inline-flex bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                              ✅ Kembali
                            </span>
                            {p.tanggalRealKembali && (
                              <p className="text-[9px] text-gray-400 font-medium">
                                Selesai: {new Date(p.tanggalRealKembali).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isBorrowed && role === 'admin' && (
                            <button
                              onClick={() => handleReturnAction(p.id, b?.nama || 'Barang', p.jumlah)}
                              className="inline-flex items-center gap-0.5 bg-green-50 hover:bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Kembalikan</span>
                            </button>
                          )}
                          {!isBorrowed && role === 'admin' && (
                            <button
                              onClick={() => handleDeleteAction(p.id)}
                              className="inline-flex items-center gap-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-md text-xs font-medium transition cursor-pointer"
                              title="Hapus riwayat permanen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {(!isBorrowed || role !== 'admin') && (
                            <span className="text-gray-400 font-medium text-xs font-mono">-</span>
                          )}
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
