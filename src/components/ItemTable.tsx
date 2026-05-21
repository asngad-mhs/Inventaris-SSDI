import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { InventarisItem } from '../types';

interface ItemTableProps {
  items: InventarisItem[];
  onEdit: (item: InventarisItem) => void;
  onDelete: (id: number) => void;
}

export default function ItemTable({ items, onEdit, onDelete }: ItemTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKondisi, setFilterKondisi] = useState<'all' | 'Baik' | 'Rusak'>('all');
  const [sortBy, setSortBy] = useState<'nama' | 'jumlah' | 'default'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and Sort calculation
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.nama.toLowerCase().includes(term) ||
        item.kategori.toLowerCase().includes(term)
      );
    }

    // Condition filter
    if (filterKondisi !== 'all') {
      result = result.filter(item => item.kondisi === filterKondisi);
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
  }, [items, searchTerm, filterKondisi, sortBy, sortOrder]);

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
      {/* PENCARIAN & FILTER PANEL */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-3 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            id="searchInput"
            placeholder="Cari berdasarkan nama atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute left-3 top-3 text-gray-400">
              <Filter className="w-4 h-4" />
            </span>
            <select
              id="filterKondisi"
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value as 'all' | 'Baik' | 'Rusak')}
              className="pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none text-gray-800"
            >
              <option value="all">📌 Semua Kondisi</option>
              <option value="Baik">✅ Baik</option>
              <option value="Rusak">⚠️ Rusak</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABEL BARANG (Responsif: scroll horizontal di HP) */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600 font-semibold">
                <th className="px-4 py-3.5 w-12 text-center">No</th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('nama')}
                >
                  <div className="flex items-center gap-1">
                    <span>Nama Barang</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 text-gray-400 ${sortBy === 'nama' ? 'text-indigo-600' : ''}`} />
                  </div>
                </th>
                <th className="px-4 py-3.5">Kategori</th>
                <th 
                  className="px-4 py-3.5 cursor-pointer hover:bg-gray-100 transition-colors text-right"
                  onClick={() => handleSort('jumlah')}
                >
                  <div className="flex items-center gap-1 justify-end">
                    <span>Jumlah</span>
                    <ArrowUpDown className={`w-3.5 h-3.5 text-gray-400 ${sortBy === 'jumlah' ? 'text-indigo-600' : ''}`} />
                  </div>
                </th>
                <th className="px-4 py-3.5">Kondisi</th>
                <th className="px-4 py-3.5 text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody id="tabelBarang" className="divide-y divide-gray-100 bg-white">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedItems.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="text-center py-10 text-gray-400 bg-gray-50/50">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="text-3xl">📭</span>
                        <p className="font-medium text-gray-500">Tidak ada barang yang cocok</p>
                        <p className="text-xs text-gray-400">Silakan sesuaikan kata kunci pencarian atau filter.</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredAndSortedItems.map((item, idx) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-4 py-3 w-12 text-center text-gray-400 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800 break-words">
                        {item.nama}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-medium text-gray-700">
                        {item.jumlah}
                      </td>
                      <td className="px-4 py-3">
                        {item.kondisi === 'Baik' ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            ✅ Baik
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            ⚠️ Rusak
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onEdit(item)}
                            className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-600 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
