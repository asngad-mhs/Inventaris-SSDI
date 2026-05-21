import { useState, useEffect } from 'react';
import {
  Package,
  LogOut,
  LayoutDashboard,
  Database,
  Tags,
  Truck,
  History,
  FileText,
  UserCircle2,
  Menu,
  X,
  Bell,
  HandHelping
} from 'lucide-react';
import { InventarisItem, UserRole, Kategori, Supplier, Peminjaman, Histori, Pengaturan } from './types';
import DashboardView from './components/DashboardView';
import ItemForm from './components/ItemForm';
import ItemTable from './components/ItemTable';
import KategoriView from './components/KategoriView';
import SupplierView from './components/SupplierView';
import PeminjamanView from './components/PeminjamanView';
import HistoriView from './components/HistoriView';
import LaporanView from './components/LaporanView';
import ProfilView from './components/ProfilView';
import ImportExportControls from './components/ImportExportControls';
import LoginScreen from './components/LoginScreen';

const STORAGE_KEY_ITEMS = 'ssdi_barang';
const STORAGE_KEY_KAT = 'ssdi_kategori';
const STORAGE_KEY_SUP = 'ssdi_supplier';
const STORAGE_KEY_LOANS = 'ssdi_peminjaman';
const STORAGE_KEY_HIST = 'ssdi_histori';
const STORAGE_KEY_CONF = 'ssdi_pengaturan';
const AUTH_KEY = 'ssdi_auth';

const DEFAULT_KATEGORI: Kategori[] = [
  { id: 1, nama: 'Elektronik', deskripsi: 'Perangkat elektronik & komputer' },
  { id: 2, nama: 'Perlengkapan', deskripsi: 'Alat tulis & perlengkapan kantor' },
  { id: 3, nama: 'Aksesoris', deskripsi: 'Kabel, adaptor, konektor' }
];

const DEFAULT_SUPPLIER: Supplier[] = [
  { id: 1, nama: 'PT Solusi Teknologi', kontak: 'Andi Wijaya', telepon: '0812345678', email: 'sales@solusitek.co.id' }
];

const DEFAULT_DATA: InventarisItem[] = [
  { id: 1001, nama: 'Monitor 22 Inch', kategoriId: 1, supplierId: 1, jumlah: 4, minimalStok: 3, kondisi: 'Baik', lokasi: 'Rak A1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 1002, nama: 'Keyboard Mekanik', kategoriId: 2, supplierId: null, jumlah: 10, minimalStok: 3, kondisi: 'Baik', lokasi: 'Rak B2', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 1003, nama: 'Mouse Wireless', kategoriId: 2, supplierId: null, jumlah: 2, minimalStok: 3, kondisi: 'Rusak', lokasi: 'Rak B3', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 1004, nama: 'Kabel HDMI 2m', kategoriId: 3, supplierId: null, jumlah: 5, minimalStok: 3, kondisi: 'Baik', lokasi: 'Rak B4', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];

export default function App() {
  const [items, setItems] = useState<InventarisItem[]>([]);
  const [kategoris, setKategoris] = useState<Kategori[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [peminjamans, setPeminjamans] = useState<Peminjaman[]>([]);
  const [historis, setHistoris] = useState<Histori[]>([]);
  const [pengaturan, setPengaturan] = useState<Pengaturan>({ stokMinimum: 3 });

  const [editingItem, setEditingItem] = useState<InventarisItem | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string>('user_demo');
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // audit activity state logger helper
  const logActivity = (aksi: string, detail: string, activeRole: UserRole, userDisplay: string) => {
    const userAlias = activeRole === 'admin' ? 'admin' : userDisplay;
    const newLog: Histori = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      userId: userAlias,
      aksi,
      detail
    };
    setHistoris(prev => {
      const updated = [newLog, ...prev].slice(0, 500);
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify(updated));
      return updated;
    });
  };

  // Initialize data and authenticate on mount
  useEffect(() => {
    // 1. Session authorization check
    const sessionAuth = sessionStorage.getItem(AUTH_KEY);
    if (sessionAuth) {
      try {
        const authData = JSON.parse(sessionAuth);
        if (authData.loggedIn && (authData.role === 'user' || authData.role === 'admin')) {
          setRole(authData.role as UserRole);
          setUsername(authData.username || 'user_demo');
        }
      } catch (e) {
        // Bad session
      }
    }
    setIsAuthLoaded(true);

    // 2. Kategori loader
    const storedKat = localStorage.getItem(STORAGE_KEY_KAT);
    let currentKats = DEFAULT_KATEGORI;
    if (storedKat) {
      try {
        const parsed = JSON.parse(storedKat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentKats = parsed;
        }
      } catch (e) {}
    }
    setKategoris(currentKats);
    localStorage.setItem(STORAGE_KEY_KAT, JSON.stringify(currentKats));

    // 3. Supplier loader
    const storedSup = localStorage.getItem(STORAGE_KEY_SUP);
    let currentSups = DEFAULT_SUPPLIER;
    if (storedSup) {
      try {
        const parsed = JSON.parse(storedSup);
        if (Array.isArray(parsed) && parsed.length > 0) {
          currentSups = parsed;
        }
      } catch (e) {}
    }
    setSuppliers(currentSups);
    localStorage.setItem(STORAGE_KEY_SUP, JSON.stringify(currentSups));

    // 4. Pengaturan loader
    const storedConf = localStorage.getItem(STORAGE_KEY_CONF);
    let currentConf = { stokMinimum: 3 };
    if (storedConf) {
      try {
        const parsed = JSON.parse(storedConf);
        if (typeof parsed.stokMinimum === 'number') {
          currentConf = parsed;
        }
      } catch (e) {}
    }
    setPengaturan(currentConf);

    // 5. Barang loader
    const storedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (storedItems) {
      try {
        const parsed = JSON.parse(storedItems);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = parsed.map((item: any) => ({
            id: item.id || Date.now() + Math.random(),
            nama: item.nama || 'Tanpa Nama',
            kategoriId: typeof item.kategoriId === 'number' ? item.kategoriId : (currentKats[0]?.id || 1),
            supplierId: typeof item.supplierId === 'number' ? item.supplierId : null,
            jumlah: typeof item.jumlah === 'number' ? item.jumlah : (parseInt(item.jumlah) || 0),
            minimalStok: typeof item.minimalStok === 'number' ? item.minimalStok : currentConf.stokMinimum,
            kondisi: (item.kondisi === 'Baik' || item.kondisi === 'Rusak') ? item.kondisi : 'Baik',
            lokasi: item.lokasi || '',
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString()
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

    // 6. Peminjaman loader
    const storedLoans = localStorage.getItem(STORAGE_KEY_LOANS);
    if (storedLoans) {
      try {
        const parsed = JSON.parse(storedLoans);
        if (Array.isArray(parsed)) {
          setPeminjamans(parsed);
        }
      } catch (e) {}
    }

    // 7. Histori loader
    const storedHist = localStorage.getItem(STORAGE_KEY_HIST);
    if (storedHist) {
      try {
        const parsed = JSON.parse(storedHist);
        if (Array.isArray(parsed)) {
          setHistoris(parsed);
        }
      } catch (e) {}
    }
  }, []);

  // Save changes to local storage
  const saveItemsAll = (newItems: InventarisItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(newItems));
  };

  const handleLogin = (selectedRole: UserRole) => {
    const userAlias = selectedRole === 'admin' ? 'admin' : `user_${Math.floor(Math.random() * 9000) + 1000}`;
    setRole(selectedRole);
    setUsername(userAlias);
    sessionStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ role: selectedRole, loggedIn: true, username: userAlias, time: Date.now() })
    );
    // Add login log entry
    const newLog: Histori = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      userId: userAlias,
      aksi: 'login',
      detail: `${selectedRole === 'admin' ? 'Administrator' : 'Pengguna biasa'} masuk ke aplikasi.`
    };
    setHistoris(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify(updated));
      return updated;
    });
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    logActivity('logout', 'Keluar dari aplikasi.', role || 'user', username);
    sessionStorage.removeItem(AUTH_KEY);
    setRole(null);
    setEditingItem(null);
    setMobileMenuOpen(false);
  };

  // BARANG/PRODUK CRUD
  const handleBarangSubmit = (formData: Omit<InventarisItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (role !== 'admin') return;

    if (editingItem) {
      const updated = items.map(item =>
        item.id === editingItem.id 
          ? { ...item, ...formData, updatedAt: new Date().toISOString() } 
          : item
      );
      saveItemsAll(updated);
      logActivity('edit_barang', `Mengubah atribut barang "${formData.nama}"`, 'admin', username);
      setEditingItem(null);
    } else {
      const newItem: InventarisItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveItemsAll([...items, newItem]);
      logActivity('tambah_barang', `Menambahkan barang baru "${formData.nama}" sebanyak ${formData.jumlah} unit`, 'admin', username);
    }
  };

  const handleBarangEditSelect = (item: InventarisItem) => {
    if (role !== 'admin') return;
    setEditingItem(item);
    const element = document.getElementById('form-barang-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleBarangDelete = (id: number) => {
    if (role !== 'admin') return;
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;

    if (window.confirm(`Apakah Anda yakin ingin menghapus barang "${targetItem.nama}"?`)) {
      const filtered = items.filter(item => item.id !== id);
      saveItemsAll(filtered);
      logActivity('hapus_barang', `Menghapus barang "${targetItem.nama}" (ID: ${id})`, 'admin', username);
      if (editingItem?.id === id) {
        setEditingItem(null);
      }
    }
  };

  // KATEGORI CRUD
  const handleKategoriAdd = (k: Omit<Kategori, 'id'>) => {
    const newK: Kategori = {
      id: Date.now() + Math.floor(Math.random() * 100),
      ...k
    };
    const updated = [...kategoris, newK];
    setKategoris(updated);
    localStorage.setItem(STORAGE_KEY_KAT, JSON.stringify(updated));
    logActivity('tambah_kategori', `Menambahkan kategori kelompok baru "${k.nama}"`, role || 'user', username);
  };

  const handleKategoriEdit = (id: number, k: Omit<Kategori, 'id'>) => {
    const updated = kategoris.map(item => item.id === id ? { ...item, ...k } : item);
    setKategoris(updated);
    localStorage.setItem(STORAGE_KEY_KAT, JSON.stringify(updated));
    logActivity('edit_kategori', `Mengubah rincian kategori "${k.nama}"`, role || 'user', username);
  };

  const handleKategoriDelete = (id: number) => {
    const kat = kategoris.find(k => k.id === id);
    const updatedKat = kategoris.filter(item => item.id !== id);
    setKategoris(updatedKat);
    localStorage.setItem(STORAGE_KEY_KAT, JSON.stringify(updatedKat));

    // Relocate items in this category to first available, or fallback category
    const targetCatId = updatedKat[0]?.id || 1;
    const updatedItems = items.map(item =>
      item.kategoriId === id ? { ...item, kategoriId: targetCatId } : item
    );
    saveItemsAll(updatedItems);
    logActivity('hapus_kategori', `Menghapus kategori "${kat?.nama || id}"`, role || 'user', username);
  };

  // SUPPLIER CRUD
  const handleSupplierAdd = (s: Omit<Supplier, 'id'>) => {
    const newS: Supplier = {
      id: Date.now() + Math.floor(Math.random() * 100),
      ...s
    };
    const updated = [...suppliers, newS];
    setSuppliers(updated);
    localStorage.setItem(STORAGE_KEY_SUP, JSON.stringify(updated));
    logActivity('tambah_supplier', `Menambahkan supplier pemasok baru "${s.nama}"`, role || 'user', username);
  };

  const handleSupplierEdit = (id: number, s: Omit<Supplier, 'id'>) => {
    const updated = suppliers.map(item => item.id === id ? { ...item, ...s } : item);
    setSuppliers(updated);
    localStorage.setItem(STORAGE_KEY_SUP, JSON.stringify(updated));
    logActivity('edit_supplier', `Mengubah atribut supplier "${s.nama}"`, role || 'user', username);
  };

  const handleSupplierDelete = (id: number) => {
    const sup = suppliers.find(s => s.id === id);
    const updated = suppliers.filter(item => item.id !== id);
    setSuppliers(updated);
    localStorage.setItem(STORAGE_KEY_SUP, JSON.stringify(updated));

    // Decouple supplier links from items
    const updatedItems = items.map(item =>
      item.supplierId === id ? { ...item, supplierId: null } : item
    );
    saveItemsAll(updatedItems);
    logActivity('hapus_supplier', `Menghapus supplier "${sup?.nama || id}"`, role || 'user', username);
  };

  // SYSTEM SETTINGS CONFIG
  const handleUpdatePengaturan = (p: Pengaturan) => {
    setPengaturan(p);
    localStorage.setItem(STORAGE_KEY_CONF, JSON.stringify(p));
    logActivity('setting_update', `Mengubah ambang batas stok minimum peringatan menjadi ${p.stokMinimum} unit`, role || 'user', username);
  };

  // PEMINJAMAN ENGINE
  const handlePinjam = (payload: { barangId: number; jumlah: number; tanggalKembali: string }) => {
    const targetItem = items.find(i => i.id === payload.barangId);
    if (!targetItem || targetItem.jumlah < payload.jumlah) return;

    // Deduct stock quantity
    const updatedItems = items.map(i =>
      i.id === payload.barangId ? { ...i, jumlah: i.jumlah - payload.jumlah } : i
    );
    saveItemsAll(updatedItems);

    // Create a borrowing log
    const newLoan: Peminjaman = {
      id: Date.now() + Math.floor(Math.random() * 100),
      barangId: payload.barangId,
      userId: username,
      jumlah: payload.jumlah,
      tanggalPinjam: new Date().toISOString(),
      tanggalKembali: payload.tanggalKembali,
      tanggalRealKembali: null,
      status: 'dipinjam'
    };
    setPeminjamans(prev => {
      const updated = [newLoan, ...prev];
      localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(updated));
      return updated;
    });

    logActivity('pinjam_barang', `Meminjam barang "${targetItem.nama}" sebanyak ${payload.jumlah} unit`, role || 'user', username);
  };

  const handleKembali = (loanId: number) => {
    const loan = peminjamans.find(p => p.id === loanId);
    if (!loan) return;

    // Restore stock quantity
    const updatedItems = items.map(i =>
      i.id === loan.barangId ? { ...i, jumlah: i.jumlah + loan.jumlah } : i
    );
    saveItemsAll(updatedItems);

    // Update loan status
    const targetItem = items.find(i => i.id === loan.barangId);
    const updatedLoans = peminjamans.map(p =>
      p.id === loanId 
        ? { ...p, status: 'kembali' as const, tanggalRealKembali: new Date().toISOString() } 
        : p
    );
    setPeminjamans(updatedLoans);
    localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(updatedLoans));

    logActivity('kembali_barang', `Mengembalikan barang "${targetItem?.nama || 'Alat'}" sebanyak ${loan.jumlah} unit`, role || 'user', username);
  };

  const handleDeletePinjam = (loanId: number) => {
    const updatedLoans = peminjamans.filter(p => p.id !== loanId);
    setPeminjamans(updatedLoans);
    localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify(updatedLoans));
  };

  const handleClearHistory = () => {
    setHistoris([]);
    localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify([]));
  };

  // DATA BACKUPS MANAGEMENT
  const handleImport = (importedItems: InventarisItem[]) => {
    if (role !== 'admin') return;
    saveItemsAll(importedItems);
    logActivity('import_json', `Mengimpor data backup JSON sebanyak ${importedItems.length} item`, 'admin', username);
    alert(`✅ Berhasil mengimpor ${importedItems.length} data barang ke sistem.`);
  };

  const handleExport = () => {
    if (role !== 'admin') return;
    try {
      const backupData = {
        app: 'inventaris_ssdi',
        version: '4.0',
        timestamp: new Date().toISOString(),
        items,
        kategoris,
        suppliers,
        peminjamans,
        historis
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `inventaris_ssdi_v4_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      logActivity('export_json', 'Mengekspor data backup logistik sistem ke berkas JSON', 'admin', username);
    } catch (err: any) {
      alert('❌ Terjadi kesalahan saat mengekspor data: ' + err.message);
    }
  };

  const handleResetToDefault = () => {
    if (role !== 'admin') return;
    if (window.confirm('⚠️ Aksi ini akan menghapus seluruh data barang, kategori, supplier, peminjaman, dan riwayat aktivitas saat ini. Lanjutkan?')) {
      saveItemsAll(DEFAULT_DATA);
      setKategoris(DEFAULT_KATEGORI);
      setSuppliers(DEFAULT_SUPPLIER);
      setPeminjamans([]);
      setPengaturan({ stokMinimum: 3 });
      
      localStorage.setItem(STORAGE_KEY_KAT, JSON.stringify(DEFAULT_KATEGORI));
      localStorage.setItem(STORAGE_KEY_SUP, JSON.stringify(DEFAULT_SUPPLIER));
      localStorage.setItem(STORAGE_KEY_LOANS, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEY_CONF, JSON.stringify({ stokMinimum: 3 }));
      
      const resetLog: Histori = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userId: 'admin',
        aksi: 'reset_default',
        detail: 'Sistem di-reset ulang ke data logistik bawaan oleh Administrator.'
      };
      setHistoris([resetLog]);
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify([resetLog]));
      setEditingItem(null);
      setActivePage('dashboard');
    }
  };

  // Dynamic alerts badge counter
  const lowStockCount = items.filter(item => item.jumlah <= item.minimalStok && item.jumlah > 0).length;

  // loading state
  if (!isAuthLoaded) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white font-semibold flex items-center gap-2">
          <span className="animate-spin inline-block">🔄</span>
          <span>Memuat Sesi Inventaris SSDI...</span>
        </div>
      </div>
    );
  }

  // Auth gate page
  if (!role) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Active page router selector
  const renderActivePageContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <DashboardView
            items={items}
            kategoris={kategoris}
            historis={historis}
            peminjamans={peminjamans}
            stokMin={pengaturan.stokMinimum}
          />
        );
      case 'barang':
        return (
          <div className="space-y-6">
            {role === 'admin' && (
              <ItemForm
                editingItem={editingItem}
                kategoris={kategoris}
                suppliers={suppliers}
                onSubmit={handleBarangSubmit}
                onCancelEdit={() => setEditingItem(null)}
              />
            )}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Daftar Inventaris Gudang
                </h3>
                <span className="text-xs text-slate-400 font-bold font-mono">
                  {items.length} Barang Terdaftar
                </span>
              </div>
              <ItemTable
                items={items}
                kategoris={kategoris}
                suppliers={suppliers}
                role={role}
                onEdit={handleBarangEditSelect}
                onDelete={handleBarangDelete}
              />
            </div>
          </div>
        );
      case 'kategori':
        return (
          <KategoriView
            kategoris={kategoris}
            inventaris={items}
            onAdd={handleKategoriAdd}
            onEdit={handleKategoriEdit}
            onDelete={handleKategoriDelete}
          />
        );
      case 'supplier':
        return (
          <SupplierView
            suppliers={suppliers}
            inventaris={items}
            onAdd={handleSupplierAdd}
            onEdit={handleSupplierEdit}
            onDelete={handleSupplierDelete}
          />
        );
      case 'peminjaman':
        return (
          <PeminjamanView
            peminjamans={peminjamans}
            inventaris={items}
            role={role}
            currentUsername={username}
            onPinjam={handlePinjam}
            onKembali={handleKembali}
            onDeletePinjam={handleDeletePinjam}
          />
        );
      case 'histori':
        return <HistoriView historis={historis} onClear={handleClearHistory} />;
      case 'laporan':
        return <LaporanView inventaris={items} kategoris={kategoris} />;
      case 'profil':
        return (
          <ProfilView
            role={role}
            username={username}
            pengaturan={pengaturan}
            onUpdatePengaturan={handleUpdatePengaturan}
          />
        );
      default:
        return <div className="text-slate-500 text-center py-10 font-medium">Halaman tidak ditemukan.</div>;
    }
  };

  // Navigation Items Configurations
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, adminOnly: false },
    { key: 'barang', label: 'Barang', icon: <Database className="w-4 h-4" />, adminOnly: false },
    { key: 'kategori', label: 'Kategori', icon: <Tags className="w-4 h-4" />, adminOnly: true },
    { key: 'supplier', label: 'Supplier', icon: <Truck className="w-4 h-4" />, adminOnly: true },
    { key: 'peminjaman', label: 'Peminjaman', icon: <HandHelping className="w-4 h-4" />, adminOnly: false },
    { key: 'histori', label: 'Audit Log', icon: <History className="w-4 h-4" />, adminOnly: true },
    { key: 'laporan', label: 'Laporan', icon: <FileText className="w-4 h-4" />, adminOnly: false },
    { key: 'profil', label: 'Profil', icon: <UserCircle2 className="w-4 h-4" />, adminOnly: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 text-slate-800 print:bg-white print:py-0 print:px-0">
      <div className="max-w-6xl mx-auto space-y-5">
        
        {/* MAIN CONTAINER APP */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
          
          {/* HEADER BAR AND BRAND */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-850 to-blue-700 px-6 py-4 text-white relative flex justify-between items-center print:hidden">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 leading-none">
                  Inventaris SSDI
                  <span className="text-[10px] bg-white/20 text-indigo-50 px-2 py-0.5 rounded-full font-bold uppercase">
                    {role === 'admin' ? '👑 Admin' : '👤 User'}
                  </span>
                </h1>
                <p className="text-indigo-200/90 text-[10px] sm:text-xs mt-1 font-semibold leading-none">
                  Complete Logistics Dashboard v4.0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications bell badge for low stock warning alert */}
              {lowStockCount > 0 && (
                <div
                  className="relative p-2 bg-yellow-500/15 border border-yellow-500/20 text-yellow-300 rounded-lg cursor-pointer hover:bg-yellow-500/25 transition shrink-0"
                  onClick={() => setActivePage('dashboard')}
                  title="${lowStockCount} barang membutuhkan perhatian segera"
                >
                  <Bell className="w-4 h-4 animate-swing" />
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-mono font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {lowStockCount}
                  </span>
                </div>
              )}

              {/* Logout button */}
              <button
                id="logoutBtn"
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 font-bold transition border border-white/5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>

              {/* Mobile menus toggle */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-white lg:hidden cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* DESKTOP NAVIGATION SUB HEADER (GRID ROW) */}
          <div className="hidden lg:flex bg-slate-900 px-5 py-2.5 gap-1.5 border-b border-slate-800 print:hidden">
            {navItems.map(item => {
              if (item.adminOnly && role !== 'admin') return null;
              const isActive = activePage === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActivePage(item.key);
                    setEditingItem(null);
                  }}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* MOBILE NAVIGATION DRAWER ROW MENU (SLIDE-DOWN CARD) */}
          {mobileMenuOpen && (
            <div className="bg-slate-900 p-4 border-b border-slate-800 space-y-1 block lg:hidden print:hidden transition-all animate-fade-in">
              {navItems.map(item => {
                if (item.adminOnly && role !== 'admin') return null;
                const isActive = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActivePage(item.key);
                      setEditingItem(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left inline-flex items-center gap-2 text-xs font-bold p-3 rounded-lg cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* APP ACTIVE MAIN CONTENT WORKSPACE */}
          <div className="p-4 sm:p-6 md:p-8" id="pageContent">
            {renderActivePageContent()}

            {/* Backups IO panel for admin rendered on 'barang' page or 'laporan' page */}
            {role === 'admin' && activePage === 'barang' && (
              <ImportExportControls
                onExport={handleExport}
                onImport={handleImport}
                onResetToDefault={handleResetToDefault}
              />
            )}
          </div>

        </div>

        {/* SYSTEM FOOTER */}
        <footer className="text-center text-slate-400 text-xs py-4 flex flex-col items-center justify-center gap-1 font-semibold print:hidden">
          <p className="font-extrabold text-slate-500">Ruang SSDI</p>
          <p>Gedung Al Ghazali Lt 1</p>
          <p className="text-[11px] text-slate-400/80">Jl. Kemerdekaan Barat No.12, Kesugihan, Cilacap, Jawa Tengah 53274</p>
        </footer>

      </div>
    </div>
  );
}
