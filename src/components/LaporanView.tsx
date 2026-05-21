import React from 'react';
import { motion } from 'motion/react';
import { FileSpreadsheet, Printer, TrendingUp, Cpu, Activity } from 'lucide-react';
import { InventarisItem, Kategori } from '../types';

interface LaporanViewProps {
  inventaris: InventarisItem[];
  kategoris: Kategori[];
}

export default function LaporanView({ inventaris, kategoris }: LaporanViewProps) {
  const totalItem = inventaris.length;
  const totalStok = inventaris.reduce((s, i) => s + i.jumlah, 0);
  const totalRusak = inventaris.filter(i => i.kondisi === 'Rusak').reduce((s, i) => s + i.jumlah, 0);
  const totalBaik = inventaris.filter(i => i.kondisi === 'Baik').reduce((s, i) => s + i.jumlah, 0);

  const getKategoriNama = (id: number) => {
    const k = kategoris.find(item => item.id === id);
    return k ? k.nama : 'Tanpa Kategori';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:bg-white print:text-black">
      {/* HEADER SECTION (HIDDEN ON PRINT) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            <span>Laporan Inventaris SSDI</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Unduh, cetak, atau buat dokumentasi fisik ringkasan data inventaris.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-1.5 font-bold transition cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan</span>
        </motion.button>
      </div>

      {/* RENDER-ONLY PRINT HEADER IN BLACK/WHITE FOR PRINTER STYLE */}
      <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">LAPORAN INVENTARIS SSDI</h1>
        <p className="text-xs font-bold text-slate-600">Dokumentasi Audit &amp; Sebaran Aset Fisik • SSDI Complete Edition</p>
        <p className="text-[10px] text-slate-500 mt-1">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
      </div>

      {/* METRICS SUMMARY CARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Macam Aset</p>
          <p className="text-xl md:text-2xl font-extrabold text-slate-800 mt-0.5">{totalItem} Jenis</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Stok Unit</p>
          <p className="text-xl md:text-2xl font-extrabold text-slate-800 mt-0.5">{totalStok} Unit</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Baik &amp; Fungsional</p>
          <p className="text-xl md:text-2xl font-extrabold text-green-700 mt-0.5">{totalBaik} Unit</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kondisi Rusak</p>
          <p className="text-xl md:text-2xl font-extrabold text-rose-700 mt-0.5">{totalRusak} Unit</p>
        </div>
      </div>

      {/* DUMP TABLE OF ALL ITEMS */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 font-semibold text-slate-700">
            <tr>
              <th className="px-5 py-3.5 w-12 text-center">No</th>
              <th className="px-5 py-3.5 text-left">Nama Barang</th>
              <th className="px-5 py-3.5 text-left">Kategori Kelompok</th>
              <th className="px-5 py-3.5 text-right w-24">Jumlah Unit</th>
              <th className="px-5 py-3.5 text-center w-28">Kondisi</th>
              <th className="px-5 py-3.5 text-left">Gudang / Lokasi Rak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 bg-white text-slate-800 font-medium">
            {inventaris.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-slate-400">
                  Tidak ada data barang untuk ditampilkan di laporan.
                </td>
              </tr>
            ) : (
              inventaris.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3.5 text-center font-mono text-xs text-slate-400">
                    {idx + 1}
                  </td>
                  <td className="px-5 py-3.5 font-bold">
                    {item.nama}
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-600">
                    {getKategoriNama(item.kategoriId)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold">
                    {item.jumlah}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.kondisi === 'Baik' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {item.kondisi === 'Baik' ? 'Baik' : 'Rusak'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 font-semibold">
                    {item.lokasi || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="hidden print:flex justify-between items-center pt-16 text-[11px] text-slate-400 font-semibold">
        <div>
          <p>Disetujui Oleh,</p>
          <p className="pt-16 uppercase font-bold text-slate-800">Kepala Gudang SSDI</p>
        </div>
        <div>
          <p>Dibuat Oleh,</p>
          <p className="pt-16 uppercase font-bold text-slate-800">Admin Logistik SSDI</p>
        </div>
      </div>
    </div>
  );
}
