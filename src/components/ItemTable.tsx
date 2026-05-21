import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Edit, Trash2, ArrowUpDown, Tag, AlertTriangle } from 'lucide-react';
import { InventarisItem, UserRole, Kategori, Supplier } from '../types';

interface ItemTableProps {
  items: InventarisItem[];
  kategoris: Kategori[];
  suppliers: Supplier[];
  role: UserRole;
  onEdit: (item: InventarisItem) => void;
  onDelete: (id: number) => void;
}

export default function ItemTable({
  items,
  kategoris,
  suppliers,
  role,
  onEdit,
  onDelete
}: ItemTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKondisi, setFilterKondisi] = useState<'all' | 'Baik' | 'Rusak'>('all');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nama' | 'jumlah' | 'default'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getKategoriNama = (id: number) => {
    const k = kategoris.find(item => item.id === id);
    return k ? k.nama : 'Tanpa Kategori';
  };

  const getSupplierNama = (id: number | null) => {
    if (!id) return '-';
    const s = suppliers.find(item => item.id === id);
    return s ? s.nama : '-';
  };

  // Filter and Sort calculation
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => {
        const katNama = getKategoriNama(item.kategoriId).toLowerCase();
        const supNama = getSupplierNama(item.supplierId).toLowerCase();
        return (
          item.nama.toLowerCase().includes(term) ||
          (item.lokasi && item.lokasi.toLowerCase().includes(term)) ||
          katNama.includes(term) ||
          supNama.includes(term)
        );
      });
    }

    // Condition filter
    if (filterKondisi !== 'all') {
      result = result.filter(item => item.kondisi === filterKondisi);
    }

    // Kategori filter
    if (filterKategori !== 'all') {
      result = result.filter(item => item.kategoriId === Number(filterKategori));
    }

    // Sorting
    if (sortBy !== 'default') {
      result.sort((a, b) => {
        let valueA = sortBy === 'nama' ? a.nama.toLowerCase() : a.jumlah;
        let valueB = sortBy === 'nama' ? b.nama.toLowerCase() : b.jumlah;

        if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
        if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, searchTerm, filterKondisi, filterKategori, sortBy, sortOrder]);

  const handleSort = (field: 'nama' | 'jumlah') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Advanced Filters layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            id="searchInput"
            placeholder="Cari nama, kelompok, supplier, lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
          />
        </div>

        {/* Filter Kondisi */}
        <div className="relative">
          <select
            id="filterKondisi"
            value={filterKondisi}
            onChange={(e) => setFilterKondisi(e.target.value as 'all' | 'Baik' | 'Rusak')}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-gray-800"
          >
            <option value="all">📌 Semua Kondisi</option>
            <option value="Baik">✅ Baik</option>
            <option value="Rusak">⚠️ Rusak</option>
          </select>
        </div>

        {/* Filter Kategori */}
        <div className="relative">
          <select
            id="filterKategori"
            value={filterKategori}
            onChange={(e) => setFilterKategori(e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-gray-800"
          >
            <option value="all">📂 Semua Kategori</option>
            {kategoris.map(k => (
              <option key={k.id} value={k.id}>📁 {k.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main interactive Table list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors text-left"
                  onClick={() => handleSort('nama')}
                >
                  <div className="flex items-center gap-1">
                    <span>Nama Barang</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 text-gray-400 ${sortBy === 'nama' ? 'text-indigo-600' : ''}`} />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-left">Kategori</th>
                <th className="px-4 py-3.5 text-left">Supplier</th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors text-right w-24"
                  onClick={() => handleSort('jumlah')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    <span>Stok</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 text-gray-400 ${sortBy === 'jumlah' ? 'text-indigo-600' : ''}`} />
                  </div>
                </th>
                <th className="px-4 py-3.5 text-center w-28">Kondisi</th>
                <th className="px-4 py-3.5 text-left">Lokasi Rak</th>
                <th className="px-4 py-3.5 text-center w-36">
                  {role === 'admin' ? 'Aksi' : 'Status'}
                </th>
              </tr>
            </thead>
            <tbody id="tabelBarang" className="divide-y divide-gray-150 bg-white">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedItems.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={8} className="text-center py-10 bg-slate-50/50 text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-3xl">📭</span>
                        <p className="font-bold text-slate-500 text-xs">Tidak ada data barang yang ditemukan</p>
                        <p className="text-[10px] text-slate-400 font-medium">Ubah kriteria pencarian atau buat barang baru.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredAndSortedItems.map((item, idx) => {
                    const isMinStok = item.jumlah <= item.minimalStok;
                    const isOutOfStock = item.jumlah === 0;
                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`hover:bg-slate-50/50 font-medium ${
                          isOutOfStock 
                            ? 'bg-rose-50/20 text-slate-400' 
                            : isMinStok 
                              ? 'bg-yellow-50/30' 
                              : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="space-y-0.5">
                            <span className="text-slate-800 font-bold block truncate max-w-[180px]" title={item.nama}>
                              {item.nama}
                            </span>
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                                Habis Total
                              </span>
                            ) : isMinStok ? (
                              <span className="inline-flex items-center gap-0.5 text-[9px] bg-yellow-100 text-yellow-850 px-1.5 py-0.5 rounded font-bold">
                                <AlertTriangle className="w-2.5 h-2.5 text-yellow-700" />
                                Stok Kritis (≤{item.minimalStok})
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 font-semibold text-xs">
                          {getKategoriNama(item.kategoriId)}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 font-semibold text-xs">
                          {getSupplierNama(item.supplierId)}
                        </td>
                        <td className={`px-4 py-3.5 text-right font-mono font-bold ${
                          isOutOfStock 
                            ? 'text-rose-600' 
                            : isMinStok 
                              ? 'text-yellow-700' 
                              : 'text-slate-850'
                        }`}>
                          {item.jumlah}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {item.kondisi === 'Baik' ? (
                            <span className="inline-flex items-center font-semibold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs">
                              ✅ Baik
                            </span>
                          ) : (
                            <span className="inline-flex items-center font-semibold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs animate-pulse">
                              ⚠️ Rusak
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-500 text-xs font-semibold max-w-[120px] truncate" title={item.lokasi}>
                          {item.lokasi || '-'}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {role === 'admin' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => onEdit(item)}
                                className="inline-flex items-center gap-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-semibold cursor-pointer transition"
                              >
                                <Edit className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => onDelete(item.id)}
                                className="inline-flex items-center gap-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2 py-1 rounded text-xs font-semibold cursor-pointer transition"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 font-mono text-xs">-</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
