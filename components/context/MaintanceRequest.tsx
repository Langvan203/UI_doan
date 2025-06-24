"use client"

import { createContext, useContext, useState } from "react";
import { GetYeuCauSuaChuaPaged, GiaoViecYeuCauChoNhanVien, StatusMaintanceRequest } from "../type/maintanceRequest";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";


interface MaintanceRequestContextType {
    yeuCauSuaChua: GetYeuCauSuaChuaPaged | undefined;
    trangThaiYeuCau: StatusMaintanceRequest[] | undefined;
    getDanhSachYeuCauSuaChua: (pageNumber?: number) => Promise<void>;
    addYeuCauSuaChua: (request: any) => Promise<void>;
    updateYeuCauSuaChua: (request: any) => Promise<void>;
    xoaYeuCauSuaChua: (id: number) => Promise<void>;
    getTrangThaiYeuCau: () => Promise<void>;
    duyetYeuCauSuaChua?: (request: number) => Promise<void>;
    tuChoiYeuCauSuaChua?: (request: number) => Promise<void>;
    giaoViecYeuCauChoNhanVien?: (request: GiaoViecYeuCauChoNhanVien) => Promise<void>;
    danhDauDaHoanThanh?: (request: number) => Promise<void>;

}
const MaintanceRequestContext = createContext<MaintanceRequestContextType | undefined>(undefined);

export const MaintanceRequestProvider = ({ children }: { children: React.ReactNode }) => {
    const [yeuCauSuaChua, setYeuCauSuaChua] = useState<GetYeuCauSuaChuaPaged>();
    const [trangThaiYeuCau, setTrangThaiYeuCau] = useState<StatusMaintanceRequest[]>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    const getDanhSachYeuCauSuaChua = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/GetDSYeuCauSuaChua/?pageNumber=${pageNumber}`, {
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
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/CreateYeuCau`, {
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
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/UpdateYeuCau`, {
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
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/DeleteYeuCau/${id}`, {
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

    const getTrangThaiYeuCau = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTTrangThaiBaoTri/GetDSTrangThaiYeuCau`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch request statuses");
            const data = await res.json();
            setTrangThaiYeuCau(data);
        } catch (error) {
            console.error("Error fetching request statuses:", error);
            toast.error("Lỗi khi tải trạng thái yêu cầu sửa chữa");
        }
    };

    const duyetYeuCauSuaChua = async (request: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/DuyetYeuCau/?maYC=${request}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to approve maintance request");
            await getDanhSachYeuCauSuaChua(1);
            toast.success("Duyệt yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error approving maintance request:", error);
            toast.error("Lỗi khi duyệt yêu cầu sửa chữa");
        }
    };

    const tuChoiYeuCauSuaChua = async (request: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/TuChoiYeuCau/?maYC=${request}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to reject maintance request");
            await getDanhSachYeuCauSuaChua(1);
            toast.success("Từ chối yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error rejecting maintance request:", error);
            toast.error("Lỗi khi từ chối yêu cầu sửa chữa");
        }
    };

    const giaoViecYeuCauChoNhanVien = async (request: GiaoViecYeuCauChoNhanVien) => {
        try {
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/GiaoViecChoNhanVien`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(request),
            });
            if (!res.ok) throw new Error("Failed to assign maintance request to employee");
            await getDanhSachYeuCauSuaChua(1);
            toast.success("Giao việc yêu cầu sửa chữa thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error assigning maintance request to employee:", error);
            toast.error("Lỗi khi giao việc yêu cầu sửa chữa");
        }
    };

    const danhDauDaHoanThanh = async (request: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/YeuCauSuaChua/DanhDauHoanThanh/?maYC=${request}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to mark maintance request as completed");
            await getDanhSachYeuCauSuaChua();
            toast.success("Đánh dấu yêu cầu sửa chữa đã hoàn thành", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error marking maintance request as completed:", error);
            toast.error("Lỗi khi đánh dấu yêu cầu sửa chữa đã hoàn thành");
        }
    };




    return (
        <MaintanceRequestContext.Provider value={{
            yeuCauSuaChua, trangThaiYeuCau,
            getDanhSachYeuCauSuaChua, 
            addYeuCauSuaChua, 
            updateYeuCauSuaChua, 
            xoaYeuCauSuaChua,
            getTrangThaiYeuCau,
            duyetYeuCauSuaChua,
            tuChoiYeuCauSuaChua,
            giaoViecYeuCauChoNhanVien,
            danhDauDaHoanThanh
        }}>
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