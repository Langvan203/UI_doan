"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";
import { CreateDichVu, GetDSDichVu } from "../type/services"


interface ServicesContextType {
    services: GetDSDichVu[];
    filteredServices: GetDSDichVu[];
    createService: (service: CreateDichVu) => Promise<void>;
    removeService: (id: number) => Promise<void>;
    fetchServices: () => Promise<void>;
}


const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider = ({ children }: { children: React.ReactNode }) => {
    const [services, setServices] = useState<GetDSDichVu[]>([]);
    const [filteredServices, setFilteredServices] = useState<GetDSDichVu[]>([]);
    const { token } = useAuth();
    const router = useRouter();

    const fetchServices = async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVu/GetDSDichVu`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setServices(data);
            setFilteredServices(data); // Initialize filtered services with all services
        } else {
            toast.error("Không thể tải danh sách dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };

    useEffect(() => {
        fetchServices();
    }, [token]);

    const createService = async (service: CreateDichVu) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVu/CreateNewDichVu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(service),
            });
            if (response.ok) {
                const newService = await response.json();
                setServices((prev) => [...prev, newService]);
                setFilteredServices((prev) => [...prev, newService]);
                toast.success("Tạo dịch vụ thành công", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            } else {
                toast.error("Không thể tạo dịch vụ", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error("Error creating service:", error);
            toast.error("Đã xảy ra lỗi khi tạo dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }
    const removeService = async (MaDV: number) => {
        if (!token) {
            toast.error("Vui lòng đăng nhập", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVu/Delete?maDV=${MaDV}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setServices((prev) => prev.filter((service) => service.id !== MaDV));
                setFilteredServices((prev) => prev.filter((service) => service.id !== MaDV));
                toast.success("Xóa dịch vụ thành công", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            } else {
                toast.error("Không thể xóa dịch vụ", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error("Error removing service:", error);
            toast.error("Đã xảy ra lỗi khi xóa dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };
    return (
        <ServicesContext.Provider value={{ services, filteredServices, createService, removeService, fetchServices }}>
            {children}
        </ServicesContext.Provider>
    );
}

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error("useServices must be used within a ServicesProvider");
    }
    return context;
};
