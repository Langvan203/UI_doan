"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { GetDSNhanVien } from "../type/employee";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";


interface StaffContextType {
    staffList: GetDSNhanVien[] | undefined;
    getStaffList: () => Promise<void>;
    addStaff: (staff: GetDSNhanVien) => Promise<void>;
    updateStaff: (staff: GetDSNhanVien) => Promise<void>;
    deleteStaff: (maNV: number) => Promise<void>;
}


const StaffContext = createContext<StaffContextType | undefined>(undefined);
export const StaffProvider = ({ children }: { children: React.ReactNode }) => {
    const [staffList, setStaffList] = useState<GetDSNhanVien[]>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    useEffect(() => {
        getStaffList();
    }, [token]);

    const getStaffList = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NhanVien/GetDSNhanVien`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch staff list");
            const data = await res.json();
            setStaffList(data);
        } catch (error) {
            console.error("Error fetching staff list:", error);
            toast.error("Lỗi khi tải danh sách nhân viên");
        }
    };

    const addStaff = async (staff: GetDSNhanVien) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NhanVien/CreateNhanVien`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(staff),
            });
            if (!res.ok) throw new Error("Failed to add staff");
            await getStaffList();
            toast.success("Thêm nhân viên thành công");
        } catch (error) {
            console.error("Error adding staff:", error);
            toast.error("Lỗi khi thêm nhân viên");
        }
    };

    const updateStaff = async (staff: GetDSNhanVien) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NhanVien/UpdateNhanVien`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(staff),
            });
            if (!res.ok) throw new Error("Failed to update staff");
            await getStaffList();
            toast.success("Cập nhật nhân viên thành công");
        } catch (error) {
            console.error("Error updating staff:", error);
            toast.error("Lỗi khi cập nhật nhân viên");
        }
    };

    const deleteStaff = async (maNV: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NhanVien/DeleteNhanVien/${maNV}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete staff");
            await getStaffList();
            toast.success("Xóa nhân viên thành công");
        } catch (error) {
            console.error("Error deleting staff:", error);
            toast.error("Lỗi khi xóa nhân viên");
        }
    };

    return (
        <StaffContext.Provider value={{ staffList, getStaffList, addStaff, updateStaff, deleteStaff }}>
            {children}
        </StaffContext.Provider>
    );
};


export const useStaff = () => {
    const context = useContext(StaffContext);
    if (!context) {
        throw new Error("useStaff must be used within a StaffProvider");
    }
    return context;
};