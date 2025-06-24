export interface GetDSHoaDon {
    maHD: number;
    maTN: number;
    maKN: number
    maTL: number;
    maMB: number;
    maKH: number;
    tenTN: string;
    nganHangThanhToan: string;
    soTaiKhoan: string;
    acqId: string;
    tenTaiKhoan: string;
    tenKN: string;
    tenTL: string;
    maVT: string;
    tenKhachHang: string;
    phaiThu: number;
    isThanhToan: boolean;
    ngayThanhToan: string;
    hoaDonDetails: HoaDonDetail[];
    emailKhachHang:string;
}

export interface HoaDonDetail {
    maHD: number;
    maDVSD: number;
    tenDichVu: string;
    tienVAT: number;
    tienBVMT: number;
    thanhTien: number;
    thueVAT: number;
    thueBVMT: number;
}

export interface HoaDonPaged {
    data: GetDSHoaDon[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BuildingInfo {
  tenCongTy: string;
  diaChi: string;
  dienThoai: string;
  email: string;
  website?: string;
  maSoThue?: string;
  nguoiDaiDien?: string;
  chucVu?: string;
  logo?: string;
  footer?: string;
}

export interface BankInfo {
  tenNganHang: string;
  soTaiKhoan: string;
  tenTaiKhoan: string;
  acqId: string;
  logo?: string;
}