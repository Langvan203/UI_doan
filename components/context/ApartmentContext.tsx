"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { GetDSMatBangForDropdown } from "../type/aparment";
import { useAuth } from "./AuthContext";


interface ApartmentContextType {
    matBang: GetDSMatBangForDropdown[];
    getDSMatBang: () => Promise<void>;
}

const ApartmentContext = createContext<ApartmentContextType | undefined>(undefined);
export const ApartmentProvider = ({ children }: { children: React.ReactNode }) => {
    const [matBang, setMatBang] = useState<GetDSMatBangForDropdown[]>([]);
    const { token } = useAuth();

    const getDSMatBang = async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/MatBang/GetDanhSachMatBangForFilters`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setMatBang(data);
        } else {
            console.error("Không thể tải danh sách khách hàng");
        }
    };

    useEffect(() => {
        getDSMatBang();
    }, [token]);

    return (
        <ApartmentContext.Provider value={{ matBang, getDSMatBang }}>
            {children}
        </ApartmentContext.Provider>
    );
};

export const useApartment = () => {
    const context = useContext(ApartmentContext);
    if (!context) {
        throw new Error("useApartment must be used within an ApartmentProvider");
    }
    return context;
};