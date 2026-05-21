import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserCircle2, ShieldAlert, KeyRound, Wrench, Save, CheckCircle } from 'lucide-react';
import { UserRole, Pengaturan } from '../types';

interface ProfilViewProps {
  role: UserRole;
  username: string;
  pengaturan: Pengaturan;
  onUpdatePengaturan: (p: Pengaturan) => void;
}

export default function ProfilView({
  role,
  username,
  pengaturan,
  onUpdatePengaturan
}: ProfilViewProps) {
  const [minStok, setMinStok] = useState(pengaturan.stokMinimum);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePengaturan({ stokMinimum: Number(minStok) });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-1.5">
          <UserCircle2 className="w-5 h-5 text-indigo-600" />
          <span>Profil Pengguna &amp; Pengaturan</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">Informasi akun aktif Anda dan konfigurasi ambang batas sistem logistik.</p>
      </div>

      <div className="bg-white border rounded-2xl p-5 md:p-6 space-y-6 shadow-sm">
        {/* User Card info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            {role === 'admin' ? (
              <span className="text-2xl font-bold">👑</span>
            ) : (
              <span className="text-2xl font-bold">👤</span>
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">{username}</h3>
            <p className="text-xs font-semibold text-slate-400 capitalize mt-0.5">Role level: {role}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5 space-y-3.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Status Akun</span>
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              Aktif / Terautentikasi
            </span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-400">Waktu Log In</span>
            <span className="text-slate-600 font-mono">{new Date().toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Configurations for Administrator Only */}
        {role === 'admin' ? (
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h4 className="font-extrabold text-slate-700 text-sm flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-indigo-600" />
              <span>Pengaturan Peringatan Logistik (Admin)</span>
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="minStokSetting" className="block text-xs font-bold text-slate-500">
                  Ambang Stok Minimum Peringatan
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    id="minStokSetting"
                    min="1"
                    value={minStok}
                    onChange={(e) => setMinStok(parseInt(e.target.value) || 1)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none bg-white transition-all text-gray-800 flex-1"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs px-4 py-2 rounded-lg flex items-center gap-1 cursor-pointer font-bold transition w-32 justify-center"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Terapkan</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Persediaan barang yang jumlah stoknya berada di bawah atau sama dengan angka ini akan memicu alarm peringatan &amp; notifikasi stok kritis.
                </p>
              </div>

              {success && (
                <div className="text-xs bg-green-50 text-green-700 border border-green-200/50 p-3 rounded-lg flex items-center gap-1.5 font-bold animate-fade-in">
                  <CheckCircle className="w-4 h-4" />
                  <span>Pengaturan sistem berhasil diperbarui dan diterapkan ke seluruh barang.</span>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="border-t border-slate-100 pt-5">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-medium italic">
              👁️ Anda masuk sebagai pengguna umum. Fitur konfigurasi ambang batas stok dialokasikan eksklusif untuk level Administrator.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
