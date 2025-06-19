export interface DongHoPaged {
    data: DongHo[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface DongHo
{
    maDH: number;
    soDongHo: string;
    chiSoSuDung: number;
    trangThai: boolean;
    maMB: number;
    maVT: string;
    tenKH: string;
    maTN: number;
    maKN: number;
    maTL: number;
    updatedDate: string;
}

export interface CreateDongHo
{
    soDongHo: string;
    chiSoSuDung: number;
    trangThai: boolean;
    maMB: number;
    maKH: number;
    maTN: number;
    maKN: number;
    maTL: number;
}

export interface UpdateDongHo
{
    maDH: number;
    soDongHo: string;
    chiSoSuDung: number;
    trangThai: boolean;
    maMB: number;
    maKH: number;
    maTN: number;
    maKN: number;
    maTL: number;
}