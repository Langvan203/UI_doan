"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateHeThong, HeThong, HeThongPaged, HeThongUpdate } from "../type/systems";
import { useAuth } from "./AuthContext";
import {toast } from "react-toastify";

interface BuildingSystemContextType {
    heThong: HeThongPaged | undefined;
    getDanhSachHeThong: (pageNumber?: number) => Promise<void>;
    addHeThong: (system: CreateHeThong) => Promise<void>;
    updateHeThong: (system: HeThongUpdate) => Promise<void>;
    xoaHeThong: (maHeThong: number) => Promise<void>;
}

const BuildingSystemContext = createContext<BuildingSystemContextType | undefined>(undefined);

export const BuildingSystemProvider = ({ children }: { children: React.ReactNode }) => {
    const [heThong, setHeThong] = useState<HeThongPaged>();
    const { token } = useAuth();
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

    useEffect(() => {
        getDanhSachHeThong(1);
    }, [token]);

    const getDanhSachHeThong = async (pageNumber: number = 1) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHeThong/GetDSHeThong/?pageNumber=${pageNumber}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch building systems");
            const data = await res.json();
            setHeThong(data);
        } catch (error) {
            console.error("Error fetching building systems:", error);
            toast.error("Lỗi khi tải danh sách hệ thống");
        }
    };

    const addHeThong = async (system: CreateHeThong) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHeThong/CreateHeThong`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(system),
            });
            if (!res.ok) throw new Error("Failed to add building system");
            await getDanhSachHeThong();
            toast.success("Thêm hệ thống thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error adding building system:", error);
            toast.error("Lỗi khi thêm hệ thống");
        }
    };

    const updateHeThong = async (system: HeThongUpdate) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHeThong/UpdateHeThong`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(system),
            });
            if (!res.ok) throw new Error("Failed to update building system");
            await getDanhSachHeThong(1);
            toast.success("Cập nhật hệ thống thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error updating building system:", error);
            toast.error("Lỗi khi cập nhật hệ thống");
        }
    }
    const xoaHeThong = async (maHeThong: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/NKBTHeThong/DeleteHeThong/?maHeThong=${maHeThong}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error("Failed to delete building system");
            await getDanhSachHeThong(1);
            toast.success("Xóa hệ thống thành công", {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error("Error deleting building system:", error);
            toast.error("Lỗi khi xóa hệ thống");
        }
    };
    return (
        <BuildingSystemContext.Provider
            value={{
                heThong,
                getDanhSachHeThong,
                addHeThong,
                updateHeThong,
                xoaHeThong,
            }}
        >
            {children}
        </BuildingSystemContext.Provider>
    );
}

export const useBuildingSystem = () => {
    const context = useContext(BuildingSystemContext);
    if (!context) {
        throw new Error("useBuildingSystem must be used within a BuildingSystemProvider");
    }
    return context;
};

