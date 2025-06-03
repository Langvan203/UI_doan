"use client"
import React from "react";
import { GetDSNhanVienDto } from "@/components/type/Staff/Staff";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface EmployeeContextType {
    employees: GetDSNhanVienDto[];
    setEmployees: (employees: GetDSNhanVienDto[]) => void;
    getListEmployee: () => Promise<GetDSNhanVienDto[]>;
    addEmployeeToDepartment: (departmentId: number, employeeId: number) => Promise<string>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: React.ReactNode }) => {
    const [employees, setEmployees] = useState<GetDSNhanVienDto[]>([]);
    const { token } = useAuth();


    useEffect(() => {
        if(token) {
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

    // const removeEmployeeFromDepartment = async (departmentId: number, employeeId: number) => {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/NhanVien/XoaNhanVienKhoiPB?MaPB=${departmentId}&manv=${employeeId}`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     const data = await response.json();
    //     return data;
    // };

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees, getListEmployee, addEmployeeToDepartment }}>
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
