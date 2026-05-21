import { motion } from 'motion/react';
import { ClipboardList, Hash, AlertTriangle } from 'lucide-react';

interface DashboardStatsProps {
  totalItem: number;
  totalStok: number;
  totalRusak: number;
}

export default function DashboardStats({ totalItem, totalStok, totalRusak }: DashboardStatsProps) {
  const cards = [
    {
      id: 'total-item',
      title: 'Total Item',
      value: totalItem,
      bgColor: 'from-blue-50 to-blue-100 border-blue-200 text-blue-800',
      labelColor: 'text-blue-600',
      iconColor: 'text-blue-500 bg-blue-100/50',
      icon: <ClipboardList className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 'total-stok',
      title: 'Total Stok',
      value: totalStok,
      bgColor: 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800',
      labelColor: 'text-emerald-600',
      iconColor: 'text-emerald-500 bg-emerald-100/50',
      icon: <Hash className="w-5 h-5 md:w-6 md:h-6" />
    },
    {
      id: 'total-rusak',
      title: 'Kondisi Rusak',
      value: totalRusak,
      bgColor: 'from-rose-50 to-rose-100 border-rose-200 text-rose-800',
      labelColor: 'text-rose-600',
      iconColor: 'text-rose-500 bg-rose-100/50',
      icon: <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" />
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
          whileHover={{ y: -2, scale: 1.01 }}
          className={`bg-gradient-to-br ${card.bgColor} rounded-xl p-4 flex items-center justify-between border shadow-sm transition-shadow hover:shadow-md`}
        >
          <div>
            <p className={`${card.labelColor} text-xs font-semibold uppercase tracking-wider`}>
              {card.title}
            </p>
            <motion.p
              key={card.value}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-2xl md:text-3xl font-extrabold"
            >
              {card.value}
            </motion.p>
          </div>
          <div className={`p-3 rounded-lg ${card.iconColor}`}>
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
