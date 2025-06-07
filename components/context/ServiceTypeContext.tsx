"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";
import { CreateLoaiDichVu, GetDSLoaiDichVu } from "../type/serviceType";


interface ServiceTypeContextType {
    serviceTypes: GetDSLoaiDichVu[];
    filteredServiceTypes: GetDSLoaiDichVu[];
    createServiceType: (serviceType: CreateLoaiDichVu) => Promise<void>;
    removeServiceType: (id: number) => Promise<void>;
}


const ServiceTypeContext = createContext<ServiceTypeContextType | undefined>(undefined);

export const ServiceTypeProvider = ({ children }: { children: React.ReactNode }) => {
    const [serviceTypes, setServiceTypes] = useState<GetDSLoaiDichVu[]>([]);
    const [filteredServiceTypes, setFilteredServiceTypes] = useState<GetDSLoaiDichVu[]>([]);
    const { token } = useAuth();
    const router = useRouter();
    const fetchServiceTypes = async () => {
        if (!token) {
            return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/LoaiDichVu/GetDSLoaiDV`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (response.ok) {
            setServiceTypes(data);
            setFilteredServiceTypes(data); // Initialize filtered service types with all service types
        } else {
            toast.error("Không thể tải danh sách loại dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };
    useEffect(() => {
        fetchServiceTypes();
    }, [token]);

    const createServiceType = async (serviceType: CreateLoaiDichVu) => {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/LoaiDichVu/CreateNewLDV`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(serviceType),
            });
            if (response.ok) {
                const newServiceType = await response.json();
                setServiceTypes((prev) => [...prev, newServiceType]);
                setFilteredServiceTypes((prev) => [...prev, newServiceType]);
                toast.success("Thêm loại dịch vụ thành công", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            } else {
                toast.error("Không thể thêm loại dịch vụ", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error("Error creating service type:", error);
            toast.error("Lỗi khi thêm loại dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
        fetchServiceTypes(); // Refresh the list after creating a new service type

    }

    const removeServiceType = async (id: number) => {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/LoaiDichVu/DeleteLoaiDV?maLDV=${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setServiceTypes((prev) => prev.filter((serviceType) => serviceType.id !== id));
                setFilteredServiceTypes((prev) => prev.filter((serviceType) => serviceType.id !== id));
                toast.success("Xóa loại dịch vụ thành công", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                fetchServiceTypes(); // Refresh the list after deletion
            } else {
                toast.error("Không thể xóa loại dịch vụ", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error("Error deleting service type:", error);
            toast.error("Lỗi khi xóa loại dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }
    return (
        <ServiceTypeContext.Provider value={{ serviceTypes, filteredServiceTypes, createServiceType, removeServiceType }}>
            {children}
        </ServiceTypeContext.Provider>
    );
}

export const useServiceType = () => {
    const context = useContext(ServiceTypeContext);
    if (!context) {
        throw new Error("useServiceType must be used within a ServiceTypeProvider");
    }
    return context;
};