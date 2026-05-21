import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShieldCheck, User, Key, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUserLogin = () => {
    onLogin('user');
  };

  const handleAdminFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin('admin');
      setErrorMsg(null);
      setShowAdminModal(false);
    } else {
      setErrorMsg('Username atau password salah! (admin / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
      >
        {/* Header dengan Gradasi Lembut */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-8 text-center text-white relative">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-md mb-3"
          >
            <Package className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Inventaris SSDI</h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1.5 font-medium">Manajemen Barang Sederhana &amp; Akurat</p>
        </div>

        {/* Pemilihan Login */}
        <div className="p-6 sm:p-8 space-y-4">
          <p className="text-center text-gray-500 text-sm font-medium">
            Pilih jenis login untuk mengakses sistem
          </p>

          <div className="space-y-3 pt-2">
            {/* Login User (Read-Only) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUserLogin}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer text-sm"
              id="loginUserBtn"
            >
              <User className="w-5 h-5 text-emerald-100" />
              <span>Login sebagai USER</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-1">Baca Saja</span>
            </motion.button>

            {/* Login Admin (Full Manage) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setErrorMsg(null);
                setUsername('');
                setPassword('');
                setShowAdminModal(true);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-md cursor-pointer text-sm"
              id="showAdminModalBtn"
            >
              <ShieldCheck className="w-5 h-5 text-indigo-100" />
              <span>Login sebagai ADMIN</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium ml-1">Kelola Penuh</span>
            </motion.button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-6 font-medium">
            🔐 Info: Login User instan | Admin menggunakan akun default
          </p>
        </div>
      </motion.div>

      {/* ADMIN LOGIN MODAL POPUP */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl relative z-10 border border-gray-150"
              id="adminModal"
            >
              <h2 className="text-lg font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Masuk sebagai Admin</span>
              </h2>

              <form onSubmit={handleAdminFormSubmit} className="space-y-4">
                {/* Username Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      id="adminUsername"
                      placeholder="Masukkan admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-800"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Key className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="adminPassword"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-10 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white text-gray-800"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs font-semibold text-rose-500 text-center animate-pulse" id="admin-login-error">
                    {errorMsg}
                  </p>
                )}

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    id="adminLoginSubmit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-2 rounded-lg text-sm font-semibold transition shadow-sm cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    id="closeAdminModal"
                    onClick={() => setShowAdminModal(false)}
                    className="flex-1 bg-gray-150 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
              <p className="text-[10px] text-gray-400 text-center mt-4">
                Petunjuk: gunakan <strong>admin</strong> / <strong>admin123</strong>
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
