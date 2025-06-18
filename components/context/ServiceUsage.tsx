"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";
import { DichVuSuDung } from "../type/serviceUsage";

interface ServicesUsageContextType {
    serviceUsages: DichVuSuDung[];
}

const ServicesUsageContext = createContext<ServicesUsageContextType | undefined>(undefined);
export const ServicesUsageProvider = ({ children }: { children: React.ReactNode }) => {     
    
    const [serviceUsages, setServiceUsages] = useState<DichVuSuDung[]>([]);
    const { token } = useAuth();
    const router = useRouter();

    const fetchServiceUsages = async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/GetAllDichVuSuDung`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setServiceUsages(data);
        } else {
            toast.error("Không thể tải danh sách dịch vụ đã sử dụng", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };

    useEffect(() => {
        fetchServiceUsages();
    }, [token]);

    return (
        <ServicesUsageContext.Provider value={{ serviceUsages }}>
            {children}
        </ServicesUsageContext.Provider>
    );
}

export const useServicesUsage = () => {
    const context = useContext(ServicesUsageContext);
    if (!context) {
        throw new Error("useServicesUsage must be used within a ServicesUsageProvider");
    }
    return context;
};