export interface HeThong {
    maHeThong: number; // Mã hệ thống
    tenHeThong: string; // Mã hệ thống
    nhanHieu: string; // Mã hệ thống
    model: string; // Mã hệ thống
    trangThai: number; // Mã hệ thống
    serialNumber: string; // Mã hệ thống
    ghiChu: string; // Mã hệ thống
    installationDate: string; // Mã hệ thống // Ngày lắp đặt
    lastMaintenanceDate: string; // Mã hệ thống // Ngày bảo trì gần nhất
    nextMaintenanceDate: string; // Mã hệ thống // Ngày bảo trì tiếp theo
    maTN: number; // Mã hệ thống
    tenTN: string; // Mã hệ thống
}

export interface HeThongPaged {
    data: HeThong[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface HeThongUpdate {
    maHeThong: number; // Mã hệ thống
    tenHeThong: string; // Tên hệ thống
    maTN: number;
    nhanHieu: string; // Nhãn hiệu
    model: string; // Model
    trangThai: number; // Trạng thái (0: Không hoạt động, 1: Hoạt động)
    serialNumber: string; // Số seri
    ghiChu: string; // Ghi chú
    ngayLapDat: Date; // Ngày lắp đặt
}

export interface CreateHeThong {
    tenHeThong: string; // Tên hệ thống
    maTN: number; // Mã tòa nhà
    ghiChu: string; // Ghi chú
    model: string; // Model
    nhanHieu: string; // Nhãn hiệu
    trangThai: number; // Trạng thái (0: Không hoạt động, 1: Hoạt động)
    serialNumber: string; // Số seri
}