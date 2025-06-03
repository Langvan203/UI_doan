import axios from 'axios';

const BASE_URL = 'https://localhost:7246/api';

export interface PremiseType {
  maLMB: number;
  tenLMB: string;
}

export interface PremiseStatus {
  maTrangThai: number;
  tenTrangThai: string;
}

export interface Building {
  id: number;
  name: string;
}

export interface Block {
  maKN: number;
  tenKN: string;
  maTN: number;
}

export interface FloorListItem {
  maTL: number;
  tenTL: string;
  maKN: number;
}

export interface Floor {
  maTL: number;
  tenTL: string;
  dienTichSan: number;
  dienTichKhuVucDungChung: number;
  dienTichKyThuaPhuTro: number;
  maKN: number;
  maTN: number;
}

export interface LoaiMatBang {
  maLMB: number;
  tenLMB: string;
}

export interface TrangThai {
  maTrangThai: number;
  tenTrangThai: string;
}

export interface Customer {
  maKH: number;
  tenKH: string;
}

export interface Premise {
  maMB: number
  maTN: number
  maKN: number
  maTL: number
  maVT: string
  dienTichBG: number
  dienTichThongThuy: number
  dienTichTimTuong: number
  soHopDong: string
  ngayBanGiao: Date | null
  ngayHetHanChoThue: Date | null
  maLMB: number
  tenLMB: string
  maKH: number
  tenKH: string,
  maTT: number,
  tenTrangThai: string,
  tenTN: string,
  tenKN: string,
  tenTL: string,
}

export interface AddNewPremise
{
  MaTN: number;
  MaKN: number;
  MaTL: number;
  MaVT: string;
  MaLMB: number;
  DienTichBG: number;
  DienTichThongThuy: number;
  DienTichTimTuong: number;
  MaTrangThai: number;
  MaKH: number | null;
  SoHopDong: string;
  NgayBanGiao: Date;
  NgayHetHanChoThue: Date;
}

export interface EditPremise
{
  MaMB: number;
  DienTichBG: number;
  DienTichThongThuy: number;  
  DienTichTimTuong: number;
  MaTrangThai: number;
  MaKhachHang: number;
  NgayBanGiao: Date;
  NgayHetHanChoThue: Date;
  
}

export interface PremiseListItem {
  maMB: number;
  maTN: number;
  maKN: number;
  maTL: number;
  maVT: string;
  dienTichBG: number;
  dienTichThongThuy: number;
  dienTichTimTuong: number;
  isBanGiao: boolean;
  soHopDong: string;
  ngayBanGiao: string;
  ngayHetHanChoThue: string;
  maLMB: number;
  tenLMB: string;
  maKH?: number | null;
  tenKH?: string;
  tenTrangThai: string;
  tenTN: string;
  tenKN: string;
  tenTL: string;
}

export interface KhachHang {
  id: number;
  name: string;
  contract: string;
}

export const premiseService = {
  // Premise Type (Loại Mặt Bằng) methods
  async getPremiseTypes(token: string | null) {
    try {
      const response = await axios.get<PremiseType[]>(`${BASE_URL}/LoaiMatBang/GetDSLoaiMatBang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching premise types:', error);
      throw error;
    }
  },

  async getKhachHangList(token: string | null) {
    try {
      const response = await axios.get<KhachHang[]>(`${BASE_URL}/KhachHang/GetDSKhachHangFilter`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching khach hang list:', error);
      throw error;
    }
  },
  
  async getTrangThaiList(token: string | null) {
    try {
      const response = await axios.get<TrangThai[]>(`${BASE_URL}/TrangThaiMatBang/GetDSTrangThaiMatBang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trang thai list:', error);
      throw error;
    }
  },

  async getLoaiMatBangList(token: string | null) {
    try {
      const response = await axios.get<LoaiMatBang[]>(`${BASE_URL}/LoaiMatBang/GetDSLoaiMatBang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching loai mat bang list:', error);
      throw error;
    }
  },

  async createPremiseType(data: { tenLMB: string }, token: string | null) {
    try {
      const response = await axios.post(`${BASE_URL}/LoaiMatBang/CreateLoaiMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating premise type:', error);
      throw error;
    }
  },

  async updatePremiseType(data: { maLMB: number; tenLMB: string }, token: string | null) {
    try {
      const response = await axios.put(`${BASE_URL}/LoaiMatBang/UpdateLoaiMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating premise type:', error);
      throw error;
    }
  },

  async deletePremise(maMB: number, token: string | null) {
    try {
      const response = await axios.delete(`${BASE_URL}/MatBang/RemoveMatBang/${maMB}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting premise:', error);
      throw error;
    }
  },
  
  async createPremise(data: AddNewPremise, token: string | null) {
    try {
      const response = await axios.post(`${BASE_URL}/MatBang/CreateMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      }); 
      return response.data;
    } catch (error) {
      console.error('Error creating premise:', error);
      throw error;
    }
  },

  async deletePremiseType(maLMB: number, token: string | null) {
    try {
      const response = await axios.delete(`${BASE_URL}/LoaiMatBang/RemoveLoaiMB/?MaLMB=${maLMB}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting premise type:', error);
      throw error;
    }
  },

  // Premise Status (Trạng Thái Mặt Bằng) methods
  async getPremiseStatuses(token: string | null) {
    try {
      const response = await axios.get<PremiseStatus[]>(`${BASE_URL}/TrangThaiMatBang/GetDSTrangThaiMatBang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching premise statuses:', error);
      throw error;
    }
  },

  async createPremiseStatus(data: { tenTrangThai: string }, token: string | null) {
    try {
      const response = await axios.post(`${BASE_URL}/TrangThaiMatBang/CreateTrangThaiMB`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating premise status:', error);
      throw error;
    }
  },

  async updatePremiseStatus(data: { maTrangThai: number; tenTrangThai: string }, token: string | null) {
    try {
      const response = await axios.put(`${BASE_URL}/TrangThaiMatBang/UpdateTrangThaiMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating premise status:', error);
      throw error;
    }
  },

  async deletePremiseStatus(maTrangThai: number, token: string | null) {
    try {
      const response = await axios.delete(`${BASE_URL}/TrangThaiMatBang/RemoveTrangThai/?MaTrangThai=${maTrangThai}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting premise status:', error);
      throw error;
    }
  },

  // Remove a premise type
  async removePremiseType(maLMB: number, token: string | null) {
    try {
      const response = await axios.delete(`${BASE_URL}/LoaiMatBang/RemoveLoaiMB/?MaLMB=${maLMB}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing premise type:', error);
      throw error;
    }
  },

  // Remove a premise status
  async removePremiseStatus(maTrangThai: number, token: string | null) {
    try {
      const response = await axios.delete(`${BASE_URL}/TrangThaiMatBang/RemoveTrangThai/?MaTT=${maTrangThai}`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing premise status:', error);
      throw error;
    }
  },

  // Building methods
  async getBuildings(token: string) {
    try {
      const response = await axios.get<Building[]>(`${BASE_URL}/ToaNha/GetDSToaNha`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching buildings:', error);
      throw error;
    }
  },

  async getBlocksByBuilding(maTN: number, token: string | null) {
    try {
      // Ensure token is not null and not an empty string
      if (!token) {
        throw new Error('Authentication token is required')
      }

      const response = await axios.get<Block[]>(`${BASE_URL}/KhoiNha/GetDSKhoiNhaByMaTN`, {
        params: { MaTN: maTN },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      
      // More detailed error handling
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server responded with error:', error.response.data);
          console.error('Status code:', error.response.status);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
        }
      }
      
      throw error;
    }
  },

  async getBlocks(token: string | null) {
    try {
      const response = await axios.get<Block[]>(`${BASE_URL}/KhoiNha/GetDSKhoiNhaFilter`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blocks:', error);
      throw error;
    }
  },

  async getFloorList(token: string | null) {
    try {
      const response = await axios.get<Floor[]>(`${BASE_URL}/TangLau/GetDSTangLauFilter`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching floors:', error);
      throw error;
    }
  },

  async getFloorsByBlock(maKN: number, token: string | null) {
    try {
      const response = await axios.get<Floor[]>(`${BASE_URL}/TangLau/GetDSTangLauByMaKN`, {
        params: { MaKN: maKN },
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching floors:', error);
      throw error;
    }
  },

  async getCustomers(token: string | null) {
    try {
      const response = await axios.get<Customer[]>(`${BASE_URL}/KhachHang/GetDSKhachHang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async editPremise(data: EditPremise, token: string | null) {
    try {
      const response = await axios.put(`${BASE_URL}/MatBang/UpdateMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error editing premise:', error);
      throw error;
    }
  },

  async getPremisesList(token: string) {
    try {
      const response = await axios.get<Premise[]>(`${BASE_URL}/MatBang/GetDSMatBang`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching premises list:', error);
      throw error;
    }
  },

  async updatePremise(data: Premise, token: string | null) {
    try {
      const response = await axios.put(`${BASE_URL}/MatBang/UpdateMatBang`, data, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating premise:', error);
      throw error;
    }
  },

  // New method to get all buildings
  async getAllBuildings(token: string | null) {
    try {
      const response = await axios.get(`https://localhost:7246/api/ToaNha/GetDSToaNha`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all buildings:', error);
      throw error;
    }
  },

  // New method to get all blocks
  async getAllBlocks(token: string | null) {
    try {
      const response = await axios.get(`https://localhost:7246/api/KhoiNha/GetDSKhoiNhaFilter`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all blocks:', error);
      throw error;
    }
  },

  // New method to get all floors
  async getAllFloors(token: string | null) {
    try {
      const response = await axios.get(`https://localhost:7246/api/TangLau/GetDSTangLauFilter`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all floors:', error);
      throw error;
    }
  },
}; 