export interface GetDSNhanVienDto {
    maNV: number;
    tenNV: string;
    ngaySinh: string;
    diaChiThuongTru: string;
    userName: string;
    email: string;
    sdt: string;
    toaNhas: NhanVienInToaNha[];
    phongBans: NhanVienPhongBan[];
    roles: NhanVienRoles[];
}

export interface NhanVienInToaNha {
    maTN: number;
    tenTN: string;
}

export interface NhanVienPhongBan {
    maPB: number;
    tenPB: string;
}

export interface NhanVienRoles {
    roleID: number;
    roleName: string;
}
export interface UpdateNhanVien {
    maNV: number;
    hoTen: string;
    tenDangNhap:string;
    email:string;
    soDienThoai:string;
    ngaySinh:string;
    diaChi: string;
}