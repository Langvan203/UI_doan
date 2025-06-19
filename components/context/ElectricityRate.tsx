"use client"

import React, { use } from "react";
import { createContext, useContext, useState } from "react";
import { DinhMuc, UpdateDinhMuc, CreateDinhMuc } from "../type/electricityRate";
import { useAuth } from "./AuthContext";


interface ElectricityRateContextType {
    electricityRates: DinhMuc[];
    setElectricityRates: (rates: DinhMuc[]) => void;
    getElectricityRates: () => Promise<DinhMuc[]>;
    addElectricityRate: (rate: CreateDinhMuc) => Promise<void>;
    updateElectricityRate: (rate: DinhMuc) => Promise<string>;
    deleteElectricityRate: (id: number) => Promise<string>;
}

const ElectricityRateContext = createContext<ElectricityRateContextType | undefined>(undefined);
export const ElectricityRateProvider = ({ children }: { children: React.ReactNode }) => {
    const [electricityRates, setElectricityRates] = useState<DinhMuc[]>([]);
    const { token } = useAuth();


    const getElectricityRates = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDinhMuc/GetDSDinhMuc`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setElectricityRates(data);
        return data;
    };

    const addElectricityRate = async (rate: CreateDinhMuc) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDinhMuc/CreateNewDinhMuc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rate)
        });
        if (response.ok) {
            await getElectricityRates();
        } else {
            throw new Error('Failed to add electricity rate');
        }
    };

    const updateElectricityRate = async (rate: DinhMuc) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDinhMuc/UpdateDinhMuc`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(rate)
        });
        if (response.ok) {
            await getElectricityRates();
            return response.text(); // Assuming the response contains a message or ID
        } else {
            return 'Có lỗi xảy ra khi cập nhật định mức điện';
        }
    };

    const deleteElectricityRate = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuDienDinhMuc/RemoveDinhMuc/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            await getElectricityRates();
            return response.text(); // Assuming the response contains a message or ID
        } else {
            return 'Có lỗi xảy ra khi xóa định mức điện';
        }
    };

    return (
        <ElectricityRateContext.Provider
            value={{
                electricityRates,
                setElectricityRates,
                getElectricityRates,
                addElectricityRate,
                updateElectricityRate,
                deleteElectricityRate
            }}
        >
            {children}
        </ElectricityRateContext.Provider>
    );
}

export const useElectricityRate = () => {
    const context = useContext(ElectricityRateContext);
    if (!context) {
        throw new Error("useElectricityRate must be used within an ElectricityRateProvider");
    }
    return context;
};