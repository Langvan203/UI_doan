export interface DichVuSuDung {
  maDVSD: number;
  ngayBatDauTinhPhi: string; // ISO date string, có thể đổi thành Date nếu cần xử lý ngày
  ghiChu: string;
  tenDV: string;
  trangThai: boolean;
  maLDV: number;
  maTN: number;
  maKH: number;
  tenKH: string;
  maTL: number;
  maKN: number;
  maVT: string;
}