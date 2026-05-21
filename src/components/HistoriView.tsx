import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { History, Search, ClipboardList, Trash } from 'lucide-react';
import { Histori } from '../types';

interface HistoriViewProps {
  historis: Histori[];
  onClear: () => void;
}

export default function HistoriView({ historis, onClear }: HistoriViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return historis;
    const term = searchTerm.toLowerCase();
    return historis.filter(h =>
      h.userId.toLowerCase().includes(term) ||
      h.aksi.toLowerCase().includes(term) ||
      h.detail.toLowerCase().includes(term)
    );
  }, [historis, searchTerm]);

  const handleClearHistory = () => {
    if (window.confirm('Hapus seluruh daftar histori aktivitas sistem secara permanen?')) {
      onClear();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
            <History className="w-5 h-5 text-indigo-600" />
            <span>Histori Aktivitas Sistem</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium font-semibold">Log real-time audit perubahan data barang, transaksi pinjam, kategori, dan autentikasi.</p>
        </div>
        {historis.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 border border-rose-200/50 text-xs px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer self-start sm:self-auto"
          >
            <Trash className="w-3.5 h-3.5" />
            <span>Bersihkan Log</span>
          </button>
        )}
      </div>

      {/* SEARCH PANEL */}
      <div className="relative">
        <span className="absolute left-3 top-3.5 text-gray-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          placeholder="Cari histori berdasarkan aksi, detail, atau nama pengguna..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800 shadow-xs"
        />
      </div>

      {/* Histori timeline/table layout */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-slate-600 font-semibold">
              <tr className="text-left">
                <th className="px-5 py-3 w-12 text-center">No</th>
                <th className="px-5 py-3 w-48">Waktu Kejadian</th>
                <th className="px-5 py-3 w-36">Pengguna</th>
                <th className="px-5 py-3 w-40">Jenis Aksi</th>
                <th className="px-5 py-3">Detail Kejadian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-450 bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <ClipboardList className="w-8 h-8 text-slate-300" />
                      <p className="font-semibold text-slate-400 text-xs">Belum ada baris riwayat aktivitas.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((h, idx) => (
                  <motion.tr
                    key={h.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-center text-slate-400 font-mono text-xs">
                      {idx + 1}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500 font-semibold">
                      {new Date(h.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-700">
                      {h.userId === 'admin' ? (
                        <span className="inline-flex items-center text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-bold">
                          👑 Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold">
                          👤 {h.userId}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono bg-slate-100 text-slate-600 border px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {h.aksi}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600">
                      {h.detail}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
