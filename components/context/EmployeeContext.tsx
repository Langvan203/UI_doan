"use client"
import React from "react";
import { GetDSNhanVienDto, UpdateNhanVien } from "@/components/type/Staff";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Update } from "next/dist/build/swc/types";
import { json } from "stream/consumers";
import { employeeService } from "@/services/employee-service";

interface EmployeeContextType {
    employees: GetDSNhanVienDto[];
    setEmployees: (employees: GetDSNhanVienDto[]) => void;
    getListEmployee: () => Promise<GetDSNhanVienDto[]>;
    addEmployeeToDepartment: (departmentId: number, employeeId: number) => Promise<string>;
    updateEmployeeInfo: (employeeData: UpdateNhanVien) => Promise<void>;
    updateEmployeeBuildings: (maNV: number, buildingIds: number[]) => Promise<void>;
    updateEmployeeDepartments: (maNV: number, departmentIds: number[]) => Promise<void>;
    updateEmployeeRoles: (maNV: number, roleIds: number[]) => Promise<void>;

}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: React.ReactNode }) => {
    const [employees, setEmployees] = useState<GetDSNhanVienDto[]>([]);
    const { token } = useAuth();


    useEffect(() => {
        if (token) {
            const fetchEmployees = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/NhanVien/GetDSNhanVien`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setEmployees(data);
            };
            fetchEmployees();
        }
    }, [token]);

    const getListEmployee = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/NhanVien/GetDSNhanVien`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setEmployees(data);
        return data;
    };

    const addEmployeeToDepartment = async (departmentId: number, employeeId: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/NhanVien/ThemNhanVienToPB?MaPB=${departmentId}&manv=${employeeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to add employee to department');
        }

        return response.text();
    };

    const updateEmployeeInfo = async (employeeData: UpdateNhanVien) => {
        try {
            await employeeService.updateEmployeeInfo(employeeData, token || '');
            await getListEmployee(); // Refresh danh sách
        } catch (error) {
            console.error('Error updating employee info:', error);
            throw error;
        }
    };

    const updateEmployeeBuildings = async (maNV: number, buildingIds: number[]) => {
        try {
            await employeeService.updateEmployeeBuildings(maNV, buildingIds, token || '');
            await getListEmployee(); // Refresh danh sách
        } catch (error) {
            console.error('Error updating employee buildings:', error);
            throw error;
        }
    };

    const updateEmployeeDepartments = async (maNV: number, departmentIds: number[]) => {
        try {
            await employeeService.updateEmployeeDepartments(maNV, departmentIds, token || '');
            await getListEmployee(); // Refresh danh sách
        } catch (error) {
            console.error('Error updating employee departments:', error);
            throw error;
        }
    };

    const updateEmployeeRoles = async (maNV: number, roleIds: number[]) => {
        try {
            await employeeService.updateEmployeeRoles(maNV, roleIds, token || '');
            await getListEmployee(); // Refresh danh sách
        } catch (error) {
            console.error('Error updating employee roles:', error);
            throw error;
        }
    };

    return (
        <EmployeeContext.Provider value={{
            employees, setEmployees, getListEmployee, addEmployeeToDepartment, updateEmployeeInfo,
            updateEmployeeBuildings,
            updateEmployeeDepartments,
            updateEmployeeRoles
        }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployee = () => {
    const context = useContext(EmployeeContext);
    if (!context) {
        throw new Error("useEmployee must be used within a EmployeeProvider");
    }
    return context;
};
