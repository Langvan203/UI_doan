"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import React from "react";
import {DongHo, CreateDongHo, UpdateDongHo, DongHoPaged} from "../type/Metter";


interface MetterContextType {
    electricMetters: DongHoPaged | undefined;
    setElectricMetters: (metters: DongHoPaged) => void;
    getElectricMetters: (pageNumber: number) => Promise<DongHoPaged[]>;
    addElectricMetter: (metter: CreateDongHo) => Promise<boolean>;
    updateElectricMetter: (metter: UpdateDongHo) => Promise<string>;
    deleteElectricMetter: (id: number) => Promise<boolean>;
    updateChiSoDongHoDien: (id:number, chiSoMoi: number) => Promise<boolean>;
    updateTrangThaiDien: (id: number, trangThai: boolean) => Promise<boolean>;

    waterMetters: DongHoPaged | undefined;
    setWaterMetters: (metters: DongHoPaged) => void;   
    getWaterMetters: (pageNumber: number) => Promise<DongHoPaged[]>;
    addWaterMetter: (metter: CreateDongHo) => Promise<boolean>;
    updateWaterMetter: (metter: UpdateDongHo) => Promise<string>;
    deleteWaterMetter: (id: number) => Promise<boolean>;
    updateChiSoDongHoNuoc: (id:number, chiSoMoi: number) => Promise<boolean>;
    updateTrangThaiNuoc: (id: number, trangThai: boolean) => Promise<boolean>;
}

const MetterContext = createContext<MetterContextType | undefined>(undefined);

export const MetterProvider = ({ children }: { children: React.ReactNode }) => {
    const [electricMetters, setElectricMetters] = useState<DongHoPaged>();
    const [waterMetters, setWaterMetters] = useState<DongHoPaged>();
    const { token } = useAuth();

    useEffect(() => {
        getElectricMetters(1);
        getWaterMetters(1);
    }, [token]);

    const getElectricMetters = async (pageNumber: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/GetDSDienDongHo/?pageNumber=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setElectricMetters(data);
        return data;
    };

    const addElectricMetter = async (metter: CreateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/CreateDienDongHo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metter)
        });
        if (response.ok) {
            await getElectricMetters(1);
            return true;
        } else if(response.status == 400) {
            return false; // Handle specific case where the request is bad
        }
        else {
            throw new Error('Failed to add electric metter');
        }
    };

    const updateElectricMetter = async (metter: UpdateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/UpdateDienDongHo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metter)
        });
        if (response.ok) {
            await getElectricMetters(1);
            return "Cập nhật đồng hồ điện thành công";
        } else {
            throw new Error('Failed to update electric metter');
        }
    };

    const deleteElectricMetter = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/RemoveDienDongHo/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            await getElectricMetters(1);
            return true;
        } else if (response.status === 400) {   
            return false; // Handle specific case where the request is bad
        } else {
            throw new Error('Failed to delete electric metter');
        }
    };

    const updateChiSoDongHoDien = async (id: number, chiSoMoi: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/UpdateChiSoMoi/?maDH=${id}&chiSoMoi=${chiSoMoi}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            await getElectricMetters(1);
            return true;
        } else if (response.status === 400) {
            return false;
        }
        else
        {
            throw new Error('Failed to update electric metter reading');
        }
    }

    const updateTrangThaiDien = async (id: number, trangThai: boolean) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDongHo/UpdateTrangThai/?maDH=${id}&trangThai=${trangThai}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            await getElectricMetters(1);
            return true;
        } else if (response.status === 400) {
            return false;
        }
        else
        {
            throw new Error('Failed to update electric metter status');
        }
    };

    const getWaterMetters = async (pageNumber: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/GetDSNuocDongHo/?pageNumber=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setWaterMetters(data);
        return data;
    };
    const addWaterMetter = async (metter: CreateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/CreateNuocDongHo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metter)
        });
        if (response.ok) {
            await getWaterMetters(1);
            return true;
        } else if(response.status == 400) {
            return false; // Handle specific case where the request is bad
        } else {
            throw new Error('Failed to add water metter');
        }
    }
    const updateWaterMetter = async (metter: UpdateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/UpdateNuocDongHo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metter)
        });
        if (response.ok) {
            await getWaterMetters(1);
            return "Cập nhật đồng hồ nước thành công";
        } else {
            throw new Error('Failed to update water metter');
        }
    };
    const deleteWaterMetter = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/RemoveNuocDongHo/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            await getWaterMetters(1);
            return true;
        } else if (response.status === 400) {
            return false; // Handle specific case where the request is bad
        } else {
            throw new Error('Failed to delete water metter');
        }
    };

    const updateChiSoDongHoNuoc = async (id: number, chiSoMoi: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/UpdateChiSoMoi/?maDH=${id}&chiSoMoi=${chiSoMoi}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            await getWaterMetters(1);
            return true;
        } else if (response.status === 400) {
            return false;
        }
        else
        {
            throw new Error('Failed to update water metter reading');
        }
    };

    const updateTrangThaiNuoc = async (id: number, trangThai: boolean) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDongHo/UpdateTrangThai/?maDH=${id}&trangThai=${trangThai}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            await getWaterMetters(1);
            return true;
        } else if (response.status === 400) {
            return false;
        }
        else
        {
            throw new Error('Failed to update water metter status');
        }
    };

    return (
        <MetterContext.Provider
            value={{
                electricMetters,
                setElectricMetters,
                getElectricMetters,
                addElectricMetter,
                updateElectricMetter,
                deleteElectricMetter,
                updateChiSoDongHoDien,
                updateTrangThaiDien,

                waterMetters,
                setWaterMetters,
                getWaterMetters,
                addWaterMetter,
                updateWaterMetter,
                deleteWaterMetter,
                updateChiSoDongHoNuoc,
                updateTrangThaiNuoc
            }}
        >
            {children}
        </MetterContext.Provider>
    );
}

export const useMetterContext = () => {
    const context = useContext(MetterContext);
    if (!context) {
        throw new Error("useMetterContext must be used within a MetterProvider");
    }
    return context;
};