"use client"
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { createContext, useContext, useEffect, useState } from "react";
import { BuildingListForDropdown, BlockListForDropdown, FloorListForDropdown,PremisseListForDropdown } from "../type/building";
export interface Building {
    maTN: number;
    tenTN: string;
    khoiNhaDetail: BlockDetail[];
}

export interface BuildingDetailed {
    id: number
    name: string
    address: string
    occupancyRate: number
    constructionYear: number
    status: string
    soTangHam: number
    soTangNoi: number
    dienTichXayDung: number
    tongDienTichSan: number
    tongDienTichChoThueNET: number
    tongDienTichChoThueGross: number
    nganHangThanhToan: string
    soTaiKhoan: string
    noiDungChuyenKhoan: string
}

export interface BuildingListItem {
    id: number;
    name: string;
}

export interface FloorListItem {
    maTL: number;
    tenTL: string;
    maKN: number;
}

export interface BlockDetail {
    maKN: number;
    tenKN: string;
    maTN: number;
    tenTN: string;
    status: number;
    totalFloors: number;
    totalPremies: number;
    occupancyRate: number;
    listTangLauInKhoiNhas: FloorDetail[];
}

export interface FloorDetail {
    maTL: number;
    tenTL: string;
    tenTN: string;
    tenKN: string;
    dienTichSan: number;
    totalPremises: number;
    maTN: number;
    maKN: number;
}

export interface CreateBlockParams {
    tenKN: string;
    maTN: number;
    trangThaiKhoiNha: number;
}

export interface UpdateBlockParams {
    maKN: number;
    tenKN: string;
    trangThaiKhoiNha: number;
}

export interface FloorApartment {
    id: number
    number: string
    floorId: number
    area: number
    status: string
    type: string
}

interface BuildingContextType {
    buildings: Building[];
    floors: FloorDetail[];
    blocks: BlockDetail[];
    buildingDetails: BuildingDetailed[];
    blockListForDropdown: BlockListForDropdown[];
    premisseListForDropdown: PremisseListForDropdown[];
    getBlockListForDropdown: () => Promise<void>;
    getFloorListForDropdown: () => Promise<void>;
    getBuildingListForDropdown: () => Promise<void>;
    getPremisseListForDropdown: () => Promise<void>;
    floorListForDropdown: FloorListForDropdown[];
    buildingListForDropdown: BuildingListForDropdown[];
    isLoading: boolean;
    error: string | null;
    createBlock: (block: CreateBlockParams) => Promise<void>;
    updateBlock: (block: UpdateBlockParams) => Promise<void>;
    deleteBlock: (blockId: number) => Promise<void>;
    getBuildingList: () => Promise<void>;
    getFloorList: () => Promise<void>;
    getBlockDetail: (blockId: number) => Promise<void>;
    getBlockList: () => Promise<void>;
    refreshData: () => Promise<void>;
}

const BuildingContext = createContext<BuildingContextType | undefined>(undefined);

export const BuildingProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [floors, setFloors] = useState<FloorDetail[]>([]);
    const [blocks, setBlocks] = useState<BlockDetail[]>([]);
    const [buildingDetails, setBuildingDetails] = useState<BuildingDetailed[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [blockListForDropdown, setBlockListForDropdown] = useState<BlockListForDropdown[]>([]);
    const [floorListForDropdown, setFloorListForDropdown] = useState<FloorListForDropdown[]>([]);
    const [buildingListForDropdown, setBuildingListForDropdown] = useState<BuildingListForDropdown[]>([]);
    const [premisseListForDropdown, setPremisseListForDropdown] = useState<PremisseListForDropdown[]>([]);


    useEffect(() => {
        if (!token) {
            console.log("No token available, skipping data fetch");
            return;
        }
        console.log("Token available, starting data fetch...");
        refreshData();
    }, [token]);


    const getBuildingListForDropdown = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ToaNha/GetDSToaNha`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Building list for dropdown:", data);
            setBuildingListForDropdown(data);
        } catch (error) {
            console.error("Error fetching building list for dropdown:", error);
            setBuildingListForDropdown([]);
            throw error;
        }
    }

    const getBlockListForDropdown = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/GetDSKhoiNhaFilter`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Block list for dropdown:", data);
            setBlockListForDropdown(data);
        } catch (error) {
            console.error("Error fetching block list for dropdown:", error);
            setBlockListForDropdown([]);
            throw error;
        }
    }

    const getFloorListForDropdown = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/TangLau/GetDSTangLauFilter`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Floor list for dropdown:", data);
            setFloorListForDropdown(data);
        } catch (error) {
            console.error("Error fetching floor list for dropdown:", error);
            setFloorListForDropdown([]);
            throw error;
        }
    }

    const getPremisseListForDropdown = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/MatBang/GetDSMatBang`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Premisse list for dropdown:", data);
            setPremisseListForDropdown(data);
        } catch (error) {
            console.error("Error fetching premisse list for dropdown:", error);
            setPremisseListForDropdown([]);
            throw error;
        }
    }

    const refreshData = async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            await Promise.all([
                getBuildingList(),
                getFloorList(),
                getBlockDetail(),
                getBuildingDetail()
            ]);
            console.log("All data loaded successfully");
        } catch (err) {
            console.error("Error loading data:", err);
            setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const getBlockList = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/GetDSKhoiNhaDetail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Blocks data:", data);
            setBlocks(data);
        } catch (error) {
            console.error("Error fetching blocks:", error);
            throw error;
        }
    }

    const getBuildingList = async () => {
        try {
            console.log("Fetching buildings...");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ToaNha/GetDSToaNha`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            if (response.status === 403) {
                toast.warning("Bạn không có quyền truy cập vào danh sách tòa nhà", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setBuildings([]);
            }
            else {
                const data = await response.json();
                console.log("Buildings API response:", data);
                console.log("Buildings count:", data?.length || 0);

                // Validate data structure
                if (Array.isArray(data)) {
                    setBuildings(data);
                    console.log("Buildings state updated, count:", data.length);
                } else {
                    console.warn("Buildings data is not an array:", data);
                    setBuildings([]);
                }
            }
        } catch (error) {
            console.error("Error fetching buildings:", error);
            throw error;
        }
    }

    const getBuildingDetail = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ToaNha/GetDSToaNha`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            if (response.status === 403) {
                toast.warning("Bạn không có quyền truy cập vào danh sách tòa nhà", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setBuildings([]);
            }
            else {
                const data = await response.json();
                console.log("Building details data:", data);

                if (Array.isArray(data)) {
                    setBuildingDetails(data);
                } else {
                    console.warn("Building details data is not an array:", data);
                    setBuildingDetails([]);
                }
            }
        } catch (error) {
            console.error("Error fetching building details:", error);
            throw error;
        }
    }

    const getFloorList = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/TangLau/GetDSTangLau`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Floors data:", data);
            setFloors(data);
        } catch (error) {
            console.error("Error fetching floors:", error);
            throw error;
        }
    }

    const getBlockDetail = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/GetDSKhoiNhaDetail`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Block details data:", data);
            setBlocks(data);
        } catch (error) {
            console.error("Error fetching block details:", error);
            throw error;
        }
    }

    const createBlock = async (block: CreateBlockParams) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/CreateKhoiNha`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'POST',
                body: JSON.stringify(block),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh data after creation
            await getBlockList();
        } catch (error) {
            console.error("Error creating block:", error);
            throw error;
        }
    }

    const updateBlock = async (block: UpdateBlockParams) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/UpdateKhoiNha`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'PUT',
                body: JSON.stringify(block),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh data after update
            await getBlockList();
        } catch (error) {
            console.error("Error updating block:", error);
            throw error;
        }
    }

    const deleteBlock = async (blockId: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/KhoiNha/DeleteKhoiNha`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                method: 'DELETE',
                body: JSON.stringify({ maKN: blockId }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Refresh data after deletion
            await getBlockList();
        } catch (error) {
            console.error("Error deleting block:", error);
            throw error;
        }
    }

    return (
        <BuildingContext.Provider value={{
            buildings,
            floors,
            blocks,
            buildingDetails,
            isLoading,
            error,
            createBlock,
            updateBlock,
            deleteBlock,
            getBuildingList,
            getFloorList,
            getBlockDetail,
            getBlockList,
            refreshData,
            getBuildingListForDropdown,
            getBlockListForDropdown,
            getFloorListForDropdown,
            getPremisseListForDropdown,
            blockListForDropdown,
            floorListForDropdown,
            buildingListForDropdown,
            premisseListForDropdown
        }}>
            {children}
        </BuildingContext.Provider>
    );
};

export const useBuilding = (): BuildingContextType => {
    const context = useContext(BuildingContext);
    if (!context) throw new Error("useBuilding must be used within BuildingProvider");
    return context;
};