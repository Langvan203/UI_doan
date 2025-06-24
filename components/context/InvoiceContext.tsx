"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { HoaDonDetail, HoaDonPaged, GetDSHoaDon } from "../type/invoices";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";


interface InvoiceContextType {
    hoaDon: HoaDonPaged | undefined;
    getDanhSachHoaDon: (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<void>;
    addHoaDon: (hoaDon: GetDSHoaDon) => Promise<void>;
    updateHoaDon: (hoaDon: GetDSHoaDon) => Promise<void>;
    xoaHoaDon: (maHD: number) => Promise<void>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);
export const InvoiceProvider = ({ children }: { children: React.ReactNode }) => {
    const [hoaDon, setHoaDon] = useState<HoaDonPaged>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    useEffect(() => {
        // Initial fetch of invoices
        getDanhSachHoaDon(1, startDate, endDate);
    }, [token]);

    const getDanhSachHoaDon = async (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const startDateStr = ngayBatDau.toISOString().split('T')[0];
        const endDateStr = ngayKetThuc.toISOString().split('T')[0];
        try {
            const res = await fetch(`${API_BASE_URL}/DichVuHoaDon/GetDSHoaDon/?pageNumber=${pageNumber}&ngayBatDau=${startDateStr}&ngayKetThuc=${endDateStr}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch invoices");
            const data = await res.json();
            setHoaDon(data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            toast.error("Lỗi khi tải danh sách hóa đơn", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    };

    // Other functions like addHoaDon, updateHoaDon, xoaHoaDon would go here...
    const addHoaDon = async (hoaDon: GetDSHoaDon) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHoaDon/CreateHoaDon`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(hoaDon),
            });
            if (!res.ok) throw new Error("Failed to add invoice");
            await getDanhSachHoaDon(1, new Date(), new Date());
            toast.success("Thêm hóa đơn thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error adding invoice:", error);
            toast.error("Lỗi khi thêm hóa đơn");
        }
    };

    const updateHoaDon = async (hoaDon: GetDSHoaDon) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHoaDon/UpdateHoaDon`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(hoaDon),
            });
            if (!res.ok) throw new Error("Failed to update invoice");
            await getDanhSachHoaDon(1, new Date(), new Date());
            toast.success("Cập nhật hóa đơn thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error updating invoice:", error);
            toast.error("Lỗi khi cập nhật hóa đơn");
        }
    };

    const xoaHoaDon = async (maHD: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHoaDon/DeleteHoaDon?maHD=${maHD}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete invoice");
            await getDanhSachHoaDon(1, new Date(), new Date());
            toast.success("Xóa hóa đơn thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } catch (error) {
            console.error("Error deleting invoice:", error);
            toast.error("Lỗi khi xóa hóa đơn");
        }
    };



    return (
        <InvoiceContext.Provider value={{ hoaDon, getDanhSachHoaDon, addHoaDon, updateHoaDon, xoaHoaDon }}>
            {children}
        </InvoiceContext.Provider>
    );
}

export const useInvoiceContext = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error("useInvoiceContext must be used within an InvoiceProvider");
    }
    return context;
};
