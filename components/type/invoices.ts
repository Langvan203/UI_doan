export interface GetDSHoaDon {
    maHD: number;
    maTN: number;
    maKN: number
    maTL: number;
    maMB: number;
    maKH: number;
    tenTN: string;
    tenKN: string;
    tenTL: string;
    maVT: string;
    tenKhachHang: string;
    phaiThu: number;
    isThanhToan: boolean;
    ngayThanhToan: string;
    hoaDonDetails: HoaDonDetail[];
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