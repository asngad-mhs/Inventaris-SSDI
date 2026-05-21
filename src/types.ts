export interface InventarisItem {
  id: number;
  nama: string;
  kategoriId: number;
  supplierId: number | null;
  jumlah: number;
  minimalStok: number;
  kondisi: 'Baik' | 'Rusak';
  lokasi: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'admin';

export interface AuthState {
  role: UserRole;
  username: string;
  loggedIn: boolean;
  time: number;
}

export interface Kategori {
  id: number;
  nama: string;
  deskripsi: string;
}

export interface Supplier {
  id: number;
  nama: string;
  kontak: string;
  telepon: string;
  email: string;
}

export interface Peminjaman {
  id: number;
  barangId: number;
  userId: string;
  jumlah: number;
  tanggalPinjam: string;
  tanggalKembali: string;
  tanggalRealKembali: string | null;
  status: 'dipinjam' | 'kembali';
}

export interface Histori {
  id: number;
  timestamp: string;
  userId: string;
  aksi: string;
  detail: string;
}

export interface Pengaturan {
  stokMinimum: number;
}

