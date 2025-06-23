"use client"

import { createContext, useContext, useState } from "react";
import { GetYeuCauSuaChuaPaged } from "../type/maintanceRequest";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";


interface MaintanceRequestContextType {
    yeuCauSuaChua: GetYeuCauSuaChuaPaged | undefined;
    getDanhSachYeuCauSuaChua: (pageNumber?: number) => Promise<void>;
    addYeuCauSuaChua: (request: any) => Promise<void>;
    updateYeuCauSuaChua: (request: any) => Promise<void>;
    xoaYeuCauSuaChua: (id: number) => Promise<void>;
}
const MaintanceRequestContext = createContext<MaintanceRequestContextType | undefined>(undefined);

export const MaintanceRequestProvider = ({ children }: { children: React.ReactNode }) => {
    const [yeuCauSuaChua, setYeuCauSuaChua] = useState<GetYeuCauSuaChuaPaged>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    const getDanhSachYeuCauSuaChua = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTYeuCau/GetDSYeuCauSuaChua/?pageNumber=${pageNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch maintance requests");
            const data = await res.json();
            setYeuCauSuaChua(data);
        } catch (error) {
            console.error("Error fetching maintance requests:", error);
            toast.error("Lỗi khi tải danh sách yêu cầu sửa chữa");
        }
    };

    // Các hàm thêm, cập nhật, xóa yêu cầu sửa chữa sẽ được định nghĩa ở đây

    const addYeuCauSuaChua = async (request: any) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTYeuCau/CreateYeuCau`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            if (!res.ok) throw new Error("Failed to add maintance request");
            await getDanhSachYeuCauSuaChua();
            toast.success("Thêm yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error adding maintance request:", error);
            toast.error("Lỗi khi thêm yêu cầu sửa chữa");
        }
    };

    const updateYeuCauSuaChua = async (request: any) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTYeuCau/UpdateYeuCau`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            if (!res.ok) throw new Error("Failed to update maintance request");
            await getDanhSachYeuCauSuaChua();
            toast.success("Cập nhật yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error updating maintance request:", error);
            toast.error("Lỗi khi cập nhật yêu cầu sửa chữa");
        }
    };

    const xoaYeuCauSuaChua = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTYeuCau/DeleteYeuCau/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete maintance request");
            await getDanhSachYeuCauSuaChua();
            toast.success("Xóa yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error deleting maintance request:", error);
            toast.error("Lỗi khi xóa yêu cầu sửa chữa");
        }
    };



    return (
        <MaintanceRequestContext.Provider value={{ yeuCauSuaChua, getDanhSachYeuCauSuaChua, addYeuCauSuaChua, updateYeuCauSuaChua, xoaYeuCauSuaChua }}>
            {children}
        </MaintanceRequestContext.Provider>
    );
};

export const useMaintanceRequest = () => {
    const context = useContext(MaintanceRequestContext);
    if (!context) {
        throw new Error("useMaintanceRequest must be used within a MaintanceRequestProvider");
    }
    return context;
};