export interface ListDepartment {
    maPB: number;
    tenPB: string;
    maTN: number;
    tenTN: string;
    nhanVienInPhongBans: ListStaffInDepartment[];
}

export interface ListStaffInDepartment {
    maNV: number;
    tenNV: string;
    email: string;
    sdt: string;
}

export interface CreateDepartment {
    tenPB: string;
    maTN: number;
}

export interface UpdateDepartment {
    maPB: number;
    tenPB: string;
    maTN: number;
}




