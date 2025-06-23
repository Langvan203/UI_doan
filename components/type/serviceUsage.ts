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

export interface GetDSYeuCauSuDungPaged {
  data: GetDSYeuCauSuDung[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetDSYeuCauSuDung {
  maDVSD: number;
  requestDate: string; // ISO date string, có thể đổi thành Date nếu cần xử lý ngày
  tenDV: string;
  maDV: number;
  trangThai: number;
  ghiChu: string;
  maLDV: number;
  maMB: number;
  maVT: string;
  maKH: number;
  tenKH: string;
  maTN: number;
  maKN: number;
  maTL: number;
}


export interface DanhSachDangSuDung {
  maDVSD: number;
  tenDV: string;
  ngayBatDauSuDung: string;
  ngayDenHanThanhToan: string;
  trangThai: boolean;
  maTN: number;
  maKN: number;
  maTL: number;
  maVT: string;
  maKH: number;
  tenKH: string;
  maLDV: number;
}

export interface DanhSachDangSuDungPaged {
  data: DanhSachDangSuDung[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CraeteDichVuSuDung {
  ngayBatDauTinhPhi: Date; // ISO date string, có thể đổi thành Date nếu cần xử lý ngày
  ngayKetThucTinhPhi: Date; // ISO date string, có thể đổi thành Date nếu cần xử lý ngày
  thanhTien: number;
  ghiChu: string;
  tienBVMT: number;
  tienVAT: number;
  maDV: number;
  maKH: number;
  maMB: number;
  maKN: number;
  maTL: number;
  maTN: number;
}


export interface GetThongKeSuDungPaged {
  data: GetThongKeSuDung[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface GetThongKeSuDung {
  maDVSD : number;
  ngayBatDauSuDung : string;
  ngayDenHanThanhToan : string;
  tienVAT : number;
  tienBVMT : number;
  thanhTien : number;
  maDV : number;
  tenDV : number;
  maKH : number;
  tenKH : number;
  maTN : number;
  maMB : number;
  maKN : number;
  maTL : number;
  maVT : number;
  isDuyetHoaDon : boolean;
  maLDV : number;
}