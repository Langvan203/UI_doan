import { is } from "date-fns/locale";

export interface GetDSLoaiDichVu {
    id: number;
    name:string;
    isEssential: boolean;
    servicesCount: number;
    icon: string;
    description: string;
    matn: number;
}

export interface CreateLoaiDichVu {
    tenLDV: string;
    icon: string;
    moTa: string;
    maTN: number | null;
    isEssential: boolean;
}