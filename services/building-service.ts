import axios from 'axios';

const BASE_URL = 'https://localhost:7246/api';

export interface Building {
  maTN: number;
  tenTN: string;
  khoiNhaDetail: BlockDetail[];
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

export const buildingService = {
  async getBlockList(token: string) {
    try {
      const response = await axios.get<Building[]>(`${BASE_URL}/KhoiNha/GetDSKhoiNhaDetail`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching block list:', error);
      throw error;
    }
  },

  async getFloorList(token: string) {
    try {
      const response = await axios.get<FloorListItem[]>(`${BASE_URL}/TangLau/GetDSTangLau`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch (error) {
      console.error('Error fetching floor list:', error);
      throw error;
    }
  },

  async getBuildingList(token: string) {
    try
    {
      const response = await axios.get<BuildingListItem[]>(`${BASE_URL}/ToaNha/GetDSToaNha`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    }
    catch (error) {
      console.error('Error fetching building list:', error);
      throw error;
    }
  },

  async getBlockDetail(id: number, token: string) {
    try {
      const response = await axios.get<Building[]>(`${BASE_URL}/KhoiNha/GetDSKhoiNha`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const block = response.data
        .flatMap(building => building.khoiNhaDetail)
        .find(block => block.maKN === id);
      return block;
    } catch (error) {
      console.error('Error fetching block detail:', error);
      throw error;
    }
  },

  async createBlock(blockData: CreateBlockParams, token: string) {
    try {
      const response = await axios.post(`${BASE_URL}/KhoiNha/CreateKhoiNha`, blockData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  },

  async deleteBlock(maKN: number, token: string) {
    try {
      const response = await axios.delete(`${BASE_URL}/KhoiNha/DeleteKhoiNha/?MaKN=${maKN}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  },

  async updateBlock(blockData: UpdateBlockParams, token: string) {
    try {
      const response = await axios.put(`${BASE_URL}/KhoiNha/UpdateKhoiNha`, blockData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  },
}; 