"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import React from "react";
import {DongHo, CreateDongHo, UpdateDongHo, DongHoPaged} from "../type/Metter";


interface MetterContextType {
    electricMetters: DongHoPaged;
    setElectricMetters: (metters: DongHoPaged) => void;
    getElectricMetters: (pageNumber: number) => Promise<DongHoPaged[]>;
    addElectricMetter: (metter: CreateDongHo) => Promise<void>;
    updateElectricMetter: (metter: UpdateDongHo) => Promise<string>;
    deleteElectricMetter: (id: number) => Promise<string>;

    waterMetters: DongHoPaged;
    setWaterMetters: (metters: DongHoPaged) => void;   
    getWaterMetters: (pageNumber: number) => Promise<DongHoPaged[]>;
    addWaterMetter: (metter: CreateDongHo) => Promise<void>;
    updateWaterMetter: (metter: UpdateDongHo) => Promise<string>;
    deleteWaterMetter: (id: number) => Promise<string>;
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
        } else {
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
            return "Xóa đồng hồ điện thành công";
        } else {
            throw new Error('Failed to delete electric metter');
        }
    };
    const getWaterMetters = async (pageNumber: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DongHoNuoc/GetDSDongHoNuoc/${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setWaterMetters(data);
        return data;
    };
    const addWaterMetter = async (metter: CreateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DongHoNuoc/CreateDongHoNuoc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(metter)
        });
        if (response.ok) {
            await getWaterMetters(1);
        } else {
            throw new Error('Failed to add water metter');
        }
    }
    const updateWaterMetter = async (metter: UpdateDongHo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DongHoNuoc/UpdateDongHoNuoc`, {
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DongHoNuoc/DeleteDongHoNuoc/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            await getWaterMetters(1);
            return "Xóa đồng hồ nước thành công";
        } else {
            throw new Error('Failed to delete water metter');
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

                waterMetters,
                setWaterMetters,
                getWaterMetters,
                addWaterMetter,
                updateWaterMetter,
                deleteWaterMetter
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