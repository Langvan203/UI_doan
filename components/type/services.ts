export interface GetDSDichVu {
    id: number
    tenDV: string;
    maLDV: number;
    donGia: number;
    tyLeVAT: number;
    tyLeBVMT: number;
    donViTinh: string;
    kyThanhToan: number;
    isThanhToanTheoKy: boolean;
}

export interface CreateDichVu {
    tenDV: string;
    maLDV: number;
    donGia: number;
    tyLeVAT: number;
    tyLeBVMT: number;
    donViTinh: string;
    kyThanhToan: number;
    isThanhToanTheoKy: boolean;
}