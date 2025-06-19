export interface DinhMuc 
{
    maDM: number;
    tenDM: string;
    chiSoDau: number;
    chiSoCuoi: number;
    donGia: number;
    description: string;
}

export interface CreateDinhMuc
{
    tenDM: string;
    chiSoDau: number;
    chiSoCuoi: number;
    donGiaDinhMuc: number;
    description: string;
}

export interface UpdateDinhMuc {
    maDM: number;
    tenDM: string;
    donGiaDinhMuc: number;
    chiSoDau: number;
    chiSoCuoi: number;
    description: string;
}