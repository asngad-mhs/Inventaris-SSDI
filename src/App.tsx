import { useState, useEffect } from 'react';
import { Package, LogOut } from 'lucide-react';
import { InventarisItem, UserRole } from './types';
import DashboardStats from './components/DashboardStats';
import ItemForm from './components/ItemForm';
import ItemTable from './components/ItemTable';
import ImportExportControls from './components/ImportExportControls';
import LoginScreen from './components/LoginScreen';

const STORAGE_KEY = 'inventaris_ssdi_app';
const AUTH_KEY = 'ssdi_auth';

const DEFAULT_DATA: InventarisItem[] = [
  { id: 1001, nama: 'Monitor 22 Inch', kategori: 'Elektronik', jumlah: 4, kondisi: 'Baik' },
  { id: 1002, nama: 'Keyboard Mekanik', kategori: 'Perlengkapan', jumlah: 10, kondisi: 'Baik' },
  { id: 1003, nama: 'Mouse Wireless', kategori: 'Perlengkapan', jumlah: 2, kondisi: 'Rusak' },
  { id: 1004, nama: 'Kabel HDMI 2m', kategori: 'Aksesoris', jumlah: 5, kondisi: 'Baik' }
];

export default function App() {
  const [items, setItems] = useState<InventarisItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventarisItem | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  // Initialize data and authenticate on mount
  useEffect(() => {
    // 1. Session authorization check
    const sessionAuth = sessionStorage.getItem(AUTH_KEY);
    if (sessionAuth) {
      try {
        const authData = JSON.parse(sessionAuth);
        if (authData.loggedIn && (authData.role === 'user' || authData.role === 'admin')) {
          setRole(authData.role as UserRole);
        }
      } catch (e) {
        // Bad session
      }
    }
    setIsAuthLoaded(true);

    // 2. Data loader
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.map((item: any) => ({
            id: item.id || Date.now() + Math.random(),
            nama: item.nama || 'Tanpa Nama',
            kategori: item.kategori || 'Umum',
            jumlah: typeof item.jumlah === 'number' ? item.jumlah : (parseInt(item.jumlah) || 0),
            kondisi: (item.kondisi === 'Baik' || item.kondisi === 'Rusak') ? item.kondisi : 'Baik'
          }));
          setItems(validated);
        } else {
          setItems(DEFAULT_DATA);
        }
      } catch (e) {
        setItems(DEFAULT_DATA);
      }
    } else {
      setItems(DEFAULT_DATA);
    }
  }, []);

  // Save changes to local storage
  const saveItems = (newItems: InventarisItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  // Auth logins handler
  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    sessionStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ role: selectedRole, loggedIn: true, time: Date.now() })
    );
  };

  // Clear session to log out
  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setRole(null);
    setEditingItem(null);
  };

  // Form submit handler (Add or Update)
  const handleFormSubmit = (formData: Omit<InventarisItem, 'id'>) => {
    if (role !== 'admin') return;

    if (editingItem) {
      // Update Mode
      const updated = items.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      );
      saveItems(updated);
      setEditingItem(null);
    } else {
      // Add Mode
      const newItem: InventarisItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        ...formData
      };
      saveItems([...items, newItem]);
    }
  };

  // Handles active selection for Editing
  const handleEditSelect = (item: InventarisItem) => {
    if (role !== 'admin') return;
    setEditingItem(item);
    
    // Smooth scroll to form container
    const element = document.getElementById('form-barang-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handles item deletion with user boundary confirmation
  const handleDeleteItem = (id: number) => {
    if (role !== 'admin') return;

    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    if (window.confirm(`Apakah Anda yakin ingin menghapus barang "${targetItem.nama}"?`)) {
      const filtered = items.filter(item => item.id !== id);
      saveItems(filtered);
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
    }
  };

  // Import JSON items
  const handleImport = (importedItems: InventarisItem[]) => {
    if (role !== 'admin') return;
    saveItems(importedItems);
    alert(`✅ Berhasil mengimpor ${importedItems.length} data barang ke sistem.`);
  };

  // Export dataset to a downloaded JSON file
  const handleExport = () => {
    if (role !== 'admin') return;
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(items, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `inventaris_ssdi_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err: any) {
      alert('❌ Terjadi kesalahan saat mengekspor data: ' + err.message);
    }
  };

  // Reset to static default data
  const handleResetToDefault = () => {
    if (role !== 'admin') return;
    if (window.confirm('⚠️ Aksi ini akan menghapus seluruh data saat ini dan mengembalikannya ke contoh bawaan. Lanjutkan?')) {
      saveItems(DEFAULT_DATA);
      setEditingItem(null);
    }
  };

  // Summary Metrics Computation
  const totalItem = items.length;
  const totalStok = items.reduce((sum, item) => sum + item.jumlah, 0);
  const totalRusak = items
    .filter(item => item.kondisi === 'Rusak')
    .reduce((sum, item) => sum + item.jumlah, 0);

  // loading state
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white font-semibold flex items-center gap-2">
          <span>🔄</span> Memuat sesi...
        </div>
      </div>
    );
  }

  // Auth gate
  if (!role) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        
        {/* MAIN CONTROLLER CARD */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
          {/* HEADER SECTION WITH DEEP COMPANION GRADIENTS & ACCESS CONTROLS */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-6 py-5 md:py-6 text-white relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                    Inventaris SSDI
                    <span className="text-xs bg-white/20 text-white/95 px-2.5 py-0.5 rounded-full font-bold ml-1">
                      {role === 'admin' ? '👑 ADMIN' : '👤 USER'}
                    </span>
                  </h1>
                  <p className="text-indigo-100/90 text-xs sm:text-sm mt-0.5 font-medium">
                    Aplikasi Manajemen Barang Sederhana &amp; Responsif
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-xs text-indigo-50 border border-white/5 font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Semua Sinkron</span>
                </div>
                
                <button
                  id="logoutBtn"
                  onClick={handleLogout}
                  className="bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition border border-white/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 space-y-6" id="appPage">
            
            {/* STATS PANELS */}
            <DashboardStats
              totalItem={totalItem}
              totalStok={totalStok}
              totalRusak={totalRusak}
            />

            {/* BARANG FORM LAYOUT (Rendered exclusively for Administrator) */}
            {role === 'admin' ? (
              <ItemForm
                editingItem={editingItem}
                onSubmit={handleFormSubmit}
                onCancelEdit={() => setEditingItem(null)}
              />
            ) : null}

            {/* TABEL LIST SECTION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Daftar Inventaris Alat
                </h3>
                <span className="text-xs text-slate-400 font-medium font-mono">
                  {items.length} item ditemukan
                </span>
              </div>
              
              <ItemTable
                items={items}
                role={role}
                onEdit={handleEditSelect}
                onDelete={handleDeleteItem}
              />
            </div>

            {/* BOTTOM CONTROLS & IO PROCEDURES OR ACCESS ALERTS */}
            {role === 'admin' ? (
              <ImportExportControls
                onExport={handleExport}
                onImport={handleImport}
                onResetToDefault={handleResetToDefault}
              />
            ) : (
              <div
                id="userReadOnlyMsg"
                className="mt-6 text-center text-sm text-amber-800 bg-amber-50 border border-amber-200/60 p-4 rounded-xl shadow-sm italic flex items-center justify-center gap-2 font-medium"
              >
                <span>👁️</span>
                <span>Mode Baca Saja — Silakan hubungi admin SSDI untuk melakukan perubahan data barang.</span>
              </div>
            )}

          </div>
        </div>

        {/* COMPREHENSIVE FOOTER */}
        <footer className="text-center text-slate-400 text-xs py-4 flex flex-col items-center justify-center gap-1 font-medium">
          <p>Inventaris SSDI • Aplikasi Pendataan Tangguh &amp; Mandiri</p>
          <p className="text-[10px] text-slate-400/80">
            Diberdayakan oleh Google AI Studio • Menggunakan Tailwind CSS &amp; React 19
          </p>
        </footer>

      </div>
    </div>
  );
}
