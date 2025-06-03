"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";

interface FilterOptions {
    buildingId?: number;
    searchTerm?: string;
}

interface DepartmentContextType {
    departments: ListDepartment[];
    filteredDepartments: ListDepartment[];
    createDepartment: (department: CreateDepartment) => Promise<void>;
    updateDepartment: (department: UpdateDepartment) => Promise<void>;
    deleteDepartment: (id: number) => Promise<void>;
    getDepartmentById: (id: number) => Promise<ListDepartment>;
    filterDepartments: (options: FilterOptions) => void;
    RefreshDepartment: () => Promise<ListDepartment[]>;
    RemoveEmployeeFromDepartment: (departmentId: number, employeeId: number) => Promise<void>;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

export const DepartmentProvider = ({ children }: { children: React.ReactNode }) => {
    const [departments, setDepartments] = useState<ListDepartment[]>([]);
    const [filteredDepartments, setFilteredDepartments] = useState<ListDepartment[]>([]);
    const { token } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!token) {
                // toast.error("Vui lòng đăng nhập", {
                //     position: "top-right",
                //     autoClose: 500,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                // });
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setDepartments(data);
                setFilteredDepartments(data); // Initialize filtered departments with all departments
            } else {
                toast.error("Không thể tải danh sách phòng ban", {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }
        };
        fetchDepartments();
    }, [token]);

    const filterDepartments = (options: FilterOptions) => {
        let filtered = [...departments];

        if (options.buildingId) {
            filtered = filtered.filter(dept => dept.maTN === options.buildingId);
        }

        if (options.searchTerm) {
            const searchLower = options.searchTerm.toLowerCase();
            filtered = filtered.filter(dept => 
                dept.tenPB.toLowerCase().includes(searchLower) ||
                dept.tenTN.toLowerCase().includes(searchLower)
            );
        }

        setFilteredDepartments(filtered);
    };

    const createDepartment = async (department: CreateDepartment) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/CreatePhongBan`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(department),
        });

        if (!response.ok) {
            throw new Error('Failed to create department');
        }

        // Refresh the departments list after successful creation
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await fetchResponse.json();
        if (fetchResponse.ok) {
            setDepartments(data);
            setFilteredDepartments(data); // Update filtered departments as well
        }
    }

    const RefreshDepartment = async (): Promise<ListDepartment[]> => {
        setIsRefreshing(true);
        try {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await fetchResponse.json();
            if (fetchResponse.ok) {
                setDepartments(data);
                setFilteredDepartments(data);
                return data; // ✅ Trả về dữ liệu mới
            }
            return [];
        } catch (error) {
            console.error('Error refreshing departments:', error);
            return [];
        } finally {
            setIsRefreshing(false);
        }
    }

    const updateDepartment = async (department: UpdateDepartment) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/UpdatePhongBan`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(department),
        });
        if (!response.ok) {
            throw new Error('Failed to update department');
        }
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
            headers: {
                Authorization: `Bearer ${token}`,   
            },
        });
        const data = await fetchResponse.json();
        if (fetchResponse.ok) {
            setDepartments(data);
            setFilteredDepartments(data); // Update filtered departments as well
        }
    }

    const deleteDepartment = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/RemovePhongBan/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete department');
        }
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await fetchResponse.json();
        if (fetchResponse.ok) {
            setDepartments(data);
            setFilteredDepartments(data); // Update filtered departments as well
        }
    }

    const getDepartmentById = async (id: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/${id}`);
        return response.json();
    }

    const RemoveEmployeeFromDepartment = async (departmentId: number, employeeId: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/RemoveNhanVienInPhongBan/${departmentId}/${employeeId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to remove employee from department');
        }
        
        // Refresh departments after removing employee
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/PhongBan/GetDSPhongBan`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await fetchResponse.json();
        if (fetchResponse.ok) {
            setDepartments(data);
            setFilteredDepartments(data); // Update filtered departments as well
        }
    }

    return (
        <DepartmentContext.Provider value={{ 
            departments, 
            filteredDepartments,
            createDepartment, 
            updateDepartment, 
            deleteDepartment, 
            getDepartmentById,
            filterDepartments,
            RemoveEmployeeFromDepartment,
            RefreshDepartment
        }}>
            {children}
        </DepartmentContext.Provider>
    );
}

export const useDepartment = (): DepartmentContextType => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useDepartment must be used within a DepartmentProvider");
    }
    return context;
}

