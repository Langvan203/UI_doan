"use client"


import { createContext, useContext, useEffect, useState } from "react";
import { GetDSKhachHangForDropdown } from "../type/resident";
import { useAuth } from "./AuthContext";


interface ResidentContextType {
    khachHang: GetDSKhachHangForDropdown[];
    getDSKhachHang: () => Promise<void>;
}

const ResidentContext = createContext<ResidentContextType | undefined>(undefined);

export const ResidentProvider = ({ children }: { children: React.ReactNode }) => {
    const [khachHang, setKhachHang] = useState<GetDSKhachHangForDropdown[]>([]);
    const { token } = useAuth();

    const getDSKhachHang = async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhachHang/GetDSKhachHangFilter`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setKhachHang(data);
        } else {
            console.error("Không thể tải danh sách khách hàng");
        }
    };

    useEffect(() => {
        getDSKhachHang();
    }, [token]);

    return (
        <ResidentContext.Provider value={{ khachHang, getDSKhachHang }}>
            {children}
        </ResidentContext.Provider>
    );
};

export const useResident = () => {
    const context = useContext(ResidentContext);
    if (!context) {
        throw new Error("useResident must be used within a ResidentProvider");
    }
    return context;
};