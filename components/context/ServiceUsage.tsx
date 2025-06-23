"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";
import { CraeteDichVuSuDung, DanhSachDangSuDung, DanhSachDangSuDungPaged, DichVuSuDung, GetDSYeuCauSuDungPaged, GetThongKeSuDungPaged } from "../type/serviceUsage";
import { get } from "http";
import { da } from "date-fns/locale";

interface ServicesUsageContextType {
    danhSachYeuCauSuDung: GetDSYeuCauSuDungPaged | undefined;
    danhSachDangSuDung: DanhSachDangSuDungPaged | undefined;
    danhsachThongKeSuDung: GetThongKeSuDungPaged | undefined;
    getDanhSachYeuCauSuDung: (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<void>;
    getDanhSachDangSuDung: (pageNumber: number) => Promise<void>;
    getDanhSachThongKeSuDung: (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<void>;
    duyetYeuCauSuDung: (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<boolean>;
    tuChoiYeuCauSuDung: (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<boolean>;
    createDichVuSuDung: (dichVuSuDung: CraeteDichVuSuDung) => Promise<void>;
    ngungSuDungDichVu: (maDVSD: number) => Promise<void>;
    tiepTucSuDungDichVu: (maDVSD: number) => Promise<void>;
    exportToExcel: (ngayBatDau: Date, ngayKetThuc: Date) => Promise<void>;
    duyetSangHoaDon: (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => Promise<boolean>;
}

const ServicesUsageContext = createContext<ServicesUsageContextType | undefined>(undefined);
export const ServicesUsageProvider = ({ children }: { children: React.ReactNode }) => {

    const [danhSachYeuCauSuDung, setDanhSachYeuCauSuDung] = useState<GetDSYeuCauSuDungPaged>();
    const [danhSachDangSuDung, setDanhSachDangSuDung] = useState<DanhSachDangSuDungPaged>();
    const [danhsachThongKeSuDung, setDanhSachThongKeSuDung] = useState<GetThongKeSuDungPaged>();
    const { token } = useAuth();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    useEffect(() => {
        getDanhSachYeuCauSuDung(1, startDate, endDate); // Fetch the first page on mount
        getDanhSachDangSuDung(1); // Fetch the first page on mount
        getDanhSachThongKeSuDung(1, startDate, endDate); // Fetch the first page on mount
    }, [token]);

    const getDanhSachYeuCauSuDung = async (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const startDateStr = ngayBatDau.toISOString().split('T')[0];
        const endDateStr = ngayKetThuc.toISOString().split('T')[0];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/GetDSYeuCauSuDung/?pageNumber=${pageNumber}&ngayBatDau=${startDateStr}&ngayKetThuc=${endDateStr}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setDanhSachYeuCauSuDung(data);
        return data;
    }

    const getDanhSachDangSuDung = async (pageNumber: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/GetDSDangSuDung/?pageNumber=${pageNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setDanhSachDangSuDung(data);
        return data;
    }

    const duyetYeuCauSuDung = async (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/DuyetYeuCau/?maDVSD=${maDVSD}&ngayBatDau=${startDate}&ngayKetThuc=${endDate}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const data = await response.text();
        if (response.ok) {
            toast.success(`${data}`, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                onClose: () => {
                    console.log("Yêu cầu đã được duyệt thành công");
                    const startDateStr = ngayBatDau.toISOString().split('T')[0];
                    const endDateStr = ngayKetThuc.toISOString().split('T')[0];
                    getDanhSachYeuCauSuDung(1, new Date(startDateStr), new Date(endDateStr)); // Optionally, you can navigate to another page or perform other actions on success
                }
            });
            // Refresh the list after approval
            return true;
        }
        else if (response.status === 400) {
            toast.error(`${data}`, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return false;
        }
        else {
            toast.error("Lỗi không xác định khi duyệt yêu cầu", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return false;
        }
    }
    const tuChoiYeuCauSuDung = async (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/TuChoiYeuCau/?maDVSD=${maDVSD}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        const data = await response.text();
        if (response.ok) {
            toast.success(`${data}`, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            const startDateStr = ngayBatDau.toISOString().split('T')[0];
            const endDateStr = ngayKetThuc.toISOString().split('T')[0];
            getDanhSachYeuCauSuDung(1, new Date(startDateStr), new Date(endDateStr)); // Refresh the list after rejection
            return true;
        }
        else if (response.status === 400) {
            toast.error(`${data}`, {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return false;
        }
        else {
            toast.error("Lỗi không xác định khi duyệt yêu cầu", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return false;
        }
    }

    const createDichVuSuDung = async (dichVuSuDung: CraeteDichVuSuDung) => {
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/CreateDichVuSuDung`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(dichVuSuDung),
            });
            if (response.ok) {
                const data = await response.json();
                toast.success("Yêu cầu sử dụng dịch vụ đã được gửi thành công", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                getDanhSachDangSuDung(1); // Refresh the list after creation
            } else {
                const errorData = await response.json();
                toast.error(`Không thể gửi yêu cầu sử dụng dịch vụ: ${errorData.message}`, {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        } catch (error) {
            console.error("Error creating service usage request:", error);
            toast.error("Đã xảy ra lỗi khi gửi yêu cầu sử dụng dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }


    const ngungSuDungDichVu = async (maDVSD: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/NgungSuDung/?maDVSD=${maDVSD}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            toast.success("Đã ngừng sử dụng dịch vụ thành công", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            getDanhSachDangSuDung(1); // Refresh the list after stopping service
        }
        else {
            toast.error("Lỗi không xác định khi ngừng sử dụng dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }

    const tiepTucSuDungDichVu = async (maDVSD: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/TiepTucSuDung/?maDVSD=${maDVSD}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            toast.success("Đã tiếp tục sử dụng dịch vụ thành công", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            getDanhSachDangSuDung(1); // Refresh the list after resuming service
        }
        else {
            toast.error("Lỗi không xác định khi tiếp tục sử dụng dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }

    const getDanhSachThongKeSuDung = async (pageNumber: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const startDateStr = ngayBatDau.toISOString().split('T')[0];
        const endDateStr = ngayKetThuc.toISOString().split('T')[0];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/GetThongKeSuDung/?pageNumber=${pageNumber}&ngayBatDau=${startDateStr}&ngayKetThuc=${endDateStr}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            setDanhSachThongKeSuDung(data);
            console.log(data)
        }
        else {
            toast.error("Không thể tải danh sách thống kê sử dụng dịch vụ", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
        return data;
    }

    const exportToExcel = async (ngayBatDau: Date, ngayKetThuc: Date) => {
        const startDateStr = ngayBatDau.toISOString().split('T')[0];
        const endDateStr = ngayKetThuc.toISOString().split('T')[0];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/ExportThongKeToExcel/?ngayBatDau=${startDateStr}&ngayKetThuc=${endDateStr}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ThongKeSuDung_${startDateStr}_to_${endDateStr}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            toast.error("Không thể xuất dữ liệu", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
    }

    const duyetSangHoaDon = async (maDVSD: number, ngayBatDau: Date, ngayKetThuc: Date) => {
        const startDateStr = ngayBatDau.toISOString().split('T')[0];
        const endDateStr = ngayKetThuc.toISOString().split('T')[0];
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/DichVuSuDung/DuyetSangHoaDon/?maDVSD=${maDVSD}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        if (response.ok) {
            toast.success("Đã duyệt sang hóa đơn thành công", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });

            getDanhSachThongKeSuDung(1, new Date(startDateStr), new Date(endDateStr));
            return true;
        } else {
            toast.error("Lỗi không xác định khi duyệt sang hóa đơn", {
                position: "top-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
            });
            return false;
        }
    }



    return (
        <ServicesUsageContext.Provider value={{
            danhSachYeuCauSuDung, danhSachDangSuDung, danhsachThongKeSuDung,
            exportToExcel,
            getDanhSachYeuCauSuDung,
            getDanhSachDangSuDung,
            getDanhSachThongKeSuDung,
            duyetYeuCauSuDung,
            tuChoiYeuCauSuDung,
            createDichVuSuDung,
            ngungSuDungDichVu,
            tiepTucSuDungDichVu,
            duyetSangHoaDon
        }}>
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