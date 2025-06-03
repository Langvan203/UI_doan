"use client"


import { createContext, useContext, useEffect, useState } from "react";
import { CreateDepartment, ListDepartment, UpdateDepartment } from "../type/department";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { headers } from "next/headers";
import { GetDSRole } from "../type/role";

interface RoleContextType {
    roles: GetDSRole[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const [roles, setRoles] = useState<GetDSRole[]>([]);
    const {token} = useAuth();
    useEffect(() => {
        const fetchRoles = async () => {
            if (!token) {
                return;
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Role/GetDSRole`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setRoles(data);
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
        fetchRoles();
    }, [token]);
    return (
        <RoleContext.Provider value={{ 
            roles
        }}>
            {children}
        </RoleContext.Provider>
    );
}
export const useRole = (): RoleContextType => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a DepartmentProvider");
    }
    return context;
}