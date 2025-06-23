"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateKeHoachBaoTri, CreateMaintancePlan, GetKeHoachBaoTriPaged, GiaoViecChoNhanVien } from "../type/maintancePlan";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";


interface MaintancePlanContextType {
    maintancePlans: CreateMaintancePlan[] | undefined;
    danhSachKeHoachBaoTri: GetKeHoachBaoTriPaged | undefined;
    getMaintancePlans: (pageNumer: number) => Promise<void>;
    getDanhSachKeHoachBaoTri: (pageNumber?: number) => Promise<void>;
    addMaintancePlan: (plan: CreateKeHoachBaoTri) => Promise<void>;
    updateMaintancePlan: (plan: CreateMaintancePlan) => Promise<void>;
    deleteMaintancePlan: (maKeHoach: number) => Promise<void>;
    giaoViecNhanVien: (nhanVien: GiaoViecChoNhanVien) => Promise<void>;
    batDauKeHoachBaoTri: (maKeHoach: number) => Promise<void>;
    hoanThanhKeHoachBaoTri: (maKeHoach: number) => Promise<void>;
    huyKeHoachBaoTri: (maKeHoach: number) => Promise<void>;
}

const MaintancePlanContext = createContext<MaintancePlanContextType | undefined>(undefined);
export const MaintancePlanProvider = ({ children }: { children: React.ReactNode }) => {
    const [maintancePlans, setMaintancePlans] = useState<CreateMaintancePlan[]>();
    const [danhSachKeHoachBaoTri, setDanhSachKeHoachBaoTri] = useState<GetKeHoachBaoTriPaged>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    useEffect(() => {
        getMaintancePlans(1);
    }, [token]);

    const getMaintancePlans = async (pageNumber: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/GetDSKeHoachBaoTri/?pageNumber=${pageNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch maintance plans");
            const data = await res.json();
            setMaintancePlans(data);
        } catch (error) {
            console.error("Error fetching maintance plans:", error);
            toast.error("Lỗi khi tải danh sách kế hoạch bảo trì", {
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

    const addMaintancePlan = async (plan: CreateKeHoachBaoTri) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/CreateKeHoachBaoTri`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(plan),
            });
            if (!res.ok) throw new Error("Failed to add maintance plan");
            await getMaintancePlans(1);
            toast.success("Thêm kế hoạch bảo trì thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error adding maintance plan:", error);
            toast.error("Lỗi khi thêm kế hoạch bảo trì", {
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

    const updateMaintancePlan = async (plan: CreateMaintancePlan) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/UpdateKeHoachBaoTri`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(plan),
            });
            if (!res.ok) throw new Error("Failed to update maintance plan");
            await getMaintancePlans(1);
            toast.success("Cập nhật kế hoạch bảo trì thành công");
        } catch (error) {
            console.error("Error updating maintance plan:", error);
            toast.error("Lỗi khi cập nhật kế hoạch bảo trì");
        }
    };

    const deleteMaintancePlan = async (maKeHoach: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/XoaKeHoach/?maKeHoach=${maKeHoach}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete maintance plan");
            toast.success("Xóa kế hoạch bảo trì thành công", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => {
                    getDanhSachKeHoachBaoTri(1);
                }
            });
        } catch (error) {
            console.error("Error deleting maintance plan:", error);
            toast.error("Lỗi khi xóa kế hoạch bảo trì");
        }
    };

    const getDanhSachKeHoachBaoTri = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/GetDSKeHoachBaoTri?pageNumber=${pageNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch maintance plans");
            const data = await res.json();
            setDanhSachKeHoachBaoTri(data);
        } catch (error) {
            console.error("Error fetching maintance plans:", error);
            toast.error("Lỗi khi tải danh sách kế hoạch bảo trì", {
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

    const giaoViecNhanVien = async (nhanVien: GiaoViecChoNhanVien) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/GiaoViecChoNhanVien`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(nhanVien),
            });
            if (!res.ok) throw new Error("Failed to assign task to employee");
            await getDanhSachKeHoachBaoTri(1);
            toast.success("Giao việc cho nhân viên thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error assigning task to employee:", error);
            toast.error("Lỗi khi giao việc cho nhân viên", {
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

    const batDauKeHoachBaoTri = async (maKeHoach: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/BatDauKeHoach/?maKeHoach=${maKeHoach}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to start maintance plan");
            await getDanhSachKeHoachBaoTri(1);
            toast.success("Bắt đầu kế hoạch bảo trì thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error starting maintance plan:", error);
            toast.error("Lỗi khi bắt đầu kế hoạch bảo trì");
        }
    };

    const hoanThanhKeHoachBaoTri = async (maKeHoach: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/HoanThanhKeHoach/?maKeHoach=${maKeHoach}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to complete maintance plan");
            await getDanhSachKeHoachBaoTri(1);
            toast.success("Hoàn thành kế hoạch bảo trì thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error completing maintance plan:", error);
            toast.error("Lỗi khi hoàn thành kế hoạch bảo trì");
        }
    };

    const huyKeHoachBaoTri = async (maKeHoach: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTKeHoachBaoTri/HuyKeHoach/?maKeHoach=${maKeHoach}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to cancel maintance plan");
            await getDanhSachKeHoachBaoTri(1);
            toast.success("Hủy kế hoạch bảo trì thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        catch (error) {
            console.error("Error canceling maintance plan:", error);
            toast.error("Lỗi khi hủy kế hoạch bảo trì");
        }
    }

    return (
        <MaintancePlanContext.Provider value={{ maintancePlans,danhSachKeHoachBaoTri, getMaintancePlans, addMaintancePlan, updateMaintancePlan, 
        deleteMaintancePlan, getDanhSachKeHoachBaoTri, giaoViecNhanVien,
        batDauKeHoachBaoTri, hoanThanhKeHoachBaoTri, huyKeHoachBaoTri }}>
            {children}
        </MaintancePlanContext.Provider>
    );
}

export const useMaintancePlan = () => {
    const context = useContext(MaintancePlanContext);
    if (!context) {
        throw new Error("useMaintancePlan must be used within a MaintancePlanProvider");
    }
    return context;
};