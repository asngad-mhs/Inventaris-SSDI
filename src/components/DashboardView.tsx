import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Hash, AlertTriangle, HandHelping, ArrowRight, Activity, Bell } from 'lucide-react';
import { InventarisItem, Kategori, Histori } from '../types';

interface DashboardViewProps {
  items: InventarisItem[];
  kategoris: Kategori[];
  historis: Histori[];
  peminjamans: any[];
  stokMin: number;
}

export default function DashboardView({ items, kategoris, historis, peminjamans, stokMin }: DashboardViewProps) {
  const totalItem = items.length;
  const totalStok = items.reduce((sum, item) => sum + item.jumlah, 0);
  const totalRusak = items
    .filter(item => item.kondisi === 'Rusak')
    .reduce((sum, item) => sum + item.jumlah, 0);
  const aktifPinjam = peminjamans.filter(p => p.status === 'dipinjam').reduce((sum, p) => sum + p.jumlah, 0);

  // Group items by category for pie-chart simulation
  const categoryStats = kategoris.map(kat => {
    const total = items.filter(item => item.kategoriId === kat.id).reduce((sum, item) => sum + item.jumlah, 0);
    return { name: kat.nama, count: total };
  }).filter(stat => stat.count > 0);

  // Top 5 items with largest stocks for bar-chart simulation
  const topItems = [...items]
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 5);

  const lowStockItems = items.filter(item => item.jumlah <= item.minimalStok && item.jumlah > 0);

  const stats = [
    {
      title: 'Total Jenis Barang',
      value: totalItem,
      color: 'from-blue-50 to-blue-100/60 text-blue-800 border-blue-200',
      text: 'text-blue-600',
      iconBg: 'bg-blue-500/10 text-blue-600',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      title: 'Total Stok Unit',
      value: totalStok,
      color: 'from-emerald-50 to-emerald-100/60 text-emerald-800 border-emerald-200',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      icon: <Hash className="w-5 h-5" />
    },
    {
      title: 'Barang Kondisi Rusak',
      value: totalRusak,
      color: 'from-rose-50 to-rose-100/60 text-rose-800 border-rose-200',
      text: 'text-rose-600',
      iconBg: 'bg-rose-500/10 text-rose-600',
      icon: <AlertTriangle className="w-5 h-5" />
    },
    {
      title: 'Barang Sedang Dipinjam',
      value: aktifPinjam,
      color: 'from-purple-50 to-purple-100/60 text-purple-800 border-purple-200',
      text: 'text-purple-600',
      iconBg: 'bg-purple-500/10 text-purple-600',
      icon: <HandHelping className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* 4 Stats Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
            className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl border flex flex-col justify-between shadow-sm relative overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-xs font-bold uppercase tracking-wider ${stat.text}`}>
                {stat.title}
              </span>
              <span className={`p-2 rounded-lg ${stat.iconBg}`}>
                {stat.icon}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl md:text-3xl font-extrabold tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Stock alert Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Visualization - Pie simulation card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>📊</span> Distrubusi Stok Kategori
            </h3>
            {categoryStats.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Belum ada sebaran stok.</p>
            ) : (
              <div className="space-y-3.5 pt-2">
                {categoryStats.map((stat, idx) => {
                  const pct = totalStok > 0 ? Math.round((stat.count / totalStok) * 100) : 0;
                  const colorMap = [
                    'bg-indigo-600', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'
                  ];
                  const color = colorMap[idx % colorMap.length];
                  return (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{stat.name}</span>
                        <span>{stat.count} unit ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full ${color}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Top items Visualization - Bar simulation card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>📈</span> 5 Barang Stok Terbanyak
            </h3>
            {topItems.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">Belum ada barang terdata.</p>
            ) : (
              <div className="space-y-4 pt-1">
                {topItems.map((item, idx) => {
                  const maxQty = Math.max(...topItems.map(i => i.jumlah), 1);
                  const widthPct = Math.round((item.jumlah / maxQty) * 100);
                  return (
                    <div key={item.id} className="flex gap-4 items-center">
                      <span className="text-slate-400 font-mono text-xs w-6 text-right">#{idx + 1}</span>
                      <div className="flex-1 space-y-1">
                        <span className="text-xs font-bold text-slate-700 block truncate">{item.nama}</span>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-800 w-12 text-right">
                        {item.jumlah}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stok Menipis Column */}
        <div className="lg:col-span-5 bg-yellow-50/70 p-5 rounded-2xl border border-yellow-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-yellow-600 animate-bounce" />
            <span>Stok Menipis &amp; Kritis</span>
          </h3>
          {lowStockItems.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-3xl">🎉</span>
              <p className="text-xs text-yellow-800 font-semibold mt-2">Semua Stok Barang Terkendali Aman!</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {lowStockItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-yellow-200/50 p-3 rounded-lg flex items-center justify-between shadow-xs transition hover:translate-x-0.5"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.nama}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Batas Minimum: {item.minimalStok} PK</p>
                  </div>
                  <span className="bg-rose-100 text-rose-800 text-xs font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap min-w-[50px] text-center">
                    Sisa: {item.jumlah}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities Timeline */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <span>Aktivitas Sistem Terbaru</span>
          </h3>
          {historis.length === 0 ? (
            <p className="text-slate-400 text-xs py-12 text-center">Tidak ada catatan aktivitas.</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {historis.slice(0, 10).map((h, idx) => (
                <div key={h.id} className="flex gap-3 text-xs border-l-2 border-indigo-100 pl-4 relative">
                  <span className="absolute -left-[6px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-extrabold text-slate-700">
                        {h.userId === 'admin' ? '👑 Admin' : `👤 ${h.userId}`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(h.timestamp).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      <span className="font-mono bg-slate-100 text-slate-700 px-1 rounded-sm text-[10px] border border-slate-200 mr-1 shrink-0 uppercase">
                        {h.aksi}
                      </span>
                      <span>{h.detail}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
