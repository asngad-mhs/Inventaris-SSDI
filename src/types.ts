export interface InventarisItem {
  id: number;
  nama: string;
  kategori: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak';
}

export type UserRole = 'user' | 'admin';

export interface AuthState {
  role: UserRole;
  loggedIn: boolean;
  time: number;
}

