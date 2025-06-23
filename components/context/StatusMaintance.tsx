"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { StatusMaintance } from "../type/statusMaintance";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface StatusMaintanceContextType {
    statusMaintance: StatusMaintance[] | undefined;
    getStatusMaintance: () => Promise<void>;
    addStatusMaintance: (status: StatusMaintance) => Promise<void>;
    updateStatusMaintance: (status: StatusMaintance) => Promise<void>;
    deleteStatusMaintance: (id: number) => Promise<void>;
}

const StatusMaintanceContext = createContext<StatusMaintanceContextType | undefined>(undefined);

export const StatusMaintanceProvider = ({ children }: { children: React.ReactNode }) => {
    const [statusMaintance, setStatusMaintance] = useState<StatusMaintance[]>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    useEffect(() => {
        getStatusMaintance();
    }, [token]);

    const getStatusMaintance = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTTrangThaiBaoTri/GetDSTrangThai`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch status maintenance");
            const data = await res.json();
            setStatusMaintance(data);
        } catch (error) {
            console.error("Error fetching status maintenance:", error);
            toast.error("Lỗi khi tải danh sách trạng thái bảo trì");
        }
    };

    const addStatusMaintance = async (status: StatusMaintance) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTTrangThaiBaoTri/CreateTrangThaiBaoTri`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(status),
            });
            if (!res.ok) throw new Error("Failed to add status maintenance");
            await getStatusMaintance();
            toast.success("Thêm trạng thái bảo trì thành công");
        } catch (error) {
            console.error("Error adding status maintenance:", error);
            toast.error("Lỗi khi thêm trạng thái bảo trì", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const updateStatusMaintance = async (status: StatusMaintance) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTTrangThaiBaoTri/UpdateTrangThaiBaoTri`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(status),
            });
            if (!res.ok) throw new Error("Failed to update status maintenance");
            await getStatusMaintance();
            toast.success("Cập nhật trạng thái bảo trì thành công");
        } catch (error) {
            console.error("Error updating status maintenance:", error);
            toast.error("Lỗi khi cập nhật trạng thái bảo trì");
        }   
    }
    const deleteStatusMaintance = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTTrangThaiBaoTri/DeleteTrangThaiBaoTri/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete status maintenance");
            await getStatusMaintance();
            toast.success("Xóa trạng thái bảo trì thành công");
        } catch (error) {
            console.error("Error deleting status maintenance:", error);
            toast.error("Lỗi khi xóa trạng thái bảo trì");
        }
    };
    return (
        <StatusMaintanceContext.Provider
            value={{
                statusMaintance,
                getStatusMaintance,
                addStatusMaintance,
                updateStatusMaintance,
                deleteStatusMaintance,
            }}
        >
            {children}
        </StatusMaintanceContext.Provider>
    );
}

export const useStatusMaintance = () => {
    const context = useContext(StatusMaintanceContext);
    if (!context) {
        throw new Error("useStatusMaintance must be used within a StatusMaintanceProvider");
    }
    return context;
};