"use client"

import React, { use } from "react";
import { createContext, useContext, useState } from "react";
import { DinhMuc, UpdateDinhMuc, CreateDinhMuc } from "../type/electricityRate";
import { useAuth } from "./AuthContext";


interface WaterRateContextType {
    WaterRates: DinhMuc[];
    setWaterRates: (rates: DinhMuc[]) => void;
    getWaterRates: () => Promise<DinhMuc[]>;
    addWaterRate: (rate: CreateDinhMuc) => Promise<void>;
    updateWaterRate: (rate: DinhMuc) => Promise<string>;
    deleteWaterRate: (id: number) => Promise<string>;
}

const WaterRateContext = createContext<WaterRateContextType | undefined>(undefined);
export const WaterRateProvider = ({ children }: { children: React.ReactNode }) => {
    const [WaterRates, setWaterRates] = useState<DinhMuc[]>([]);
    const { token } = useAuth();


    const getWaterRates = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDinhMuc/GetDSDinhMucNuoc`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setWaterRates(data);
        return data;
    };

    const addWaterRate = async (rate: CreateDinhMuc) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDinhMuc/CreateDinhMucNuoc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rate)
        });
        if (response.ok) {
            await getWaterRates();
        } else {
            throw new Error('Failed to add Water rate');
        }
    };

    const updateWaterRate = async (rate: DinhMuc) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDinhMuc/UpdateDinhMucNuoc`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rate)
        });
        if (response.ok) {
            await getWaterRates();
            return response.text();
        } else {
            return "Có lỗi xảy ra khi cập nhật định mức nước";
        }
    };

    const deleteWaterRate = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuNuocDinhMuc/RemoveDinhMucNuoc/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            await getWaterRates();
            return response.text(); // Assuming the response contains a message or ID
        } else {
            return "Có lỗi xảy ra khi xóa định mức nước";
        }
    };

    return (
        <WaterRateContext.Provider
            value={{
                WaterRates,
                setWaterRates,
                getWaterRates,
                addWaterRate,
                updateWaterRate,
                deleteWaterRate
            }}
        >
            {children}
        </WaterRateContext.Provider>
    );
}

export const useWaterRate = () => {
    const context = useContext(WaterRateContext);
    if (!context) {
        throw new Error("useWaterRate must be used within an WaterRateProvider");
    }
    return context;
};