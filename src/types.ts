export interface InventarisItem {
  id: number;
  nama: string;
  kategori: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak';
}
