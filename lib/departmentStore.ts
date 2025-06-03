
import { create } from "zustand"

interface Department {
    maPB: number;
    tenPB: string;
    maTN: number;
    tenTN: string;
}

interface DepartmentState {
    departments: Department[];
    status: "idle" | "loading" | "error";
    error: string | null;
    fetchDepartments: () => Promise<void>;
}
        
const useDepartmentStore = create<DepartmentState>((set,get) => ({
    departments: [],
    status: "idle",
    error: null,
    fetchDepartments: async () => {
        set({ status: "loading" });
        try {
            const response = await fetch("https://localhost:7246/api/PhongBan/GetDSPhongBan", {
                headers: {
                    "Authorization": `Bearer ${get()}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch departments");
            }
            const data = await response.json();
            set({ departments: data, status: "idle" });
        } catch (error) {
            set({ status: "error", error: "Failed to fetch departments" });
        }
    },
}));

export default useDepartmentStore;
