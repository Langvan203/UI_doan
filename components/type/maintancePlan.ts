export interface CreateMaintancePlan {
    tenKeHoach: string;
    loaiBaoTri: number;
    maHeThong: number;
    maTrangThai: number;
    tanSuat: number;
    moTaCongViec: string;
    ngayBaoTri: Date; // Ngày bảo trì, sử dụng Date để dễ dàng thao tác với ngày tháng
}

export interface GetKeHoachBaoTriDetail {
    maKeHoach: number;
    tenKeHoach: string;
    maHeThong: number;
    loaiBaoTri: number;
    tenHeThong: string;
    ngayBaoTri: string;
    tanSuat: number;
    nhanVienInBaoTris: NhanVienInBaoTri[];
    trangThai: number;
    moTa: string;
    chiTietInKeHoachBaoTris: chiTietKeHoachBaoTri[];
    lichSuBaoTriKeHoaches: lichSuBaoTri[];
}

export interface NhanVienInBaoTri {
    maNV: number;
    tenNV: string;
}

export interface chiTietKeHoachBaoTri {
    ghiChu: string;
    maTrangThai: number;

}

export interface lichSuBaoTri {
    tieuDe: string;
    ngayCapNhat: string;
    noiDung: string;
}

export interface GetKeHoachBaoTriPaged {
    data: GetKeHoachBaoTriDetail[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}


export interface CreateKeHoachBaoTri {
    tenKeHoach: string;
    loaiBaoTri: number; // Mã loại bảo trì
    maHeThong: number; // Mã hệ thống
    maTrangThai: number; // Mã trạng thái
    tanSuat: number; // Tần suất bảo trì
    moTaCongViec: string; // Mô tả công việc bảo trì
    ngayBaoTri: Date; // Ngày bảo trì, sử dụng Date để dễ dàng thao tác với ngày tháng
    chiTietBaoTris: chiTietKeHoachBaoTri[]; // Danh sách chi tiết bảo trì
    danhSachNhanVien: number[]; // Danh sách mã nhân viên tham gia bảo trì
}

export interface GiaoViecChoNhanVien {
    maKeHoach: number; // Mã kế hoạch bảo trì
    maNV: number[]; // Danh sách mã nhân viên được giao việc
    isThongBaoNhanVienCu: boolean; // Thông báo cho nhân viên cũ
    isThongBaoNhanVienMoi: boolean; // Thông báo cho nhân viên mới
}