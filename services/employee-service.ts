import { useAuth } from "@/components/context/AuthContext";
import { UpdateNhanVien } from "@/components/type/Staff";
import { number } from "zod";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const employeeService = {
  // Cập nhật thông tin cơ bản nhân viên
  async updateEmployeeInfo(employeeData: UpdateNhanVien,token: string): Promise<any> {


    const response = await fetch(`${API_BASE_URL}/NhanVien/UpdateThongTinNhanVien`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee info');
    }

    return response.json();
  },

  // Cập nhật tòa nhà của nhân viên
  async updateEmployeeBuildings(maNV: number, buildingIds: number[],token: string): Promise<any> {


    const response = await fetch(`${API_BASE_URL}/NhanVien/UpdateNhanVienToaNha`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maNV: maNV,
        dsToaNha: buildingIds,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update employee buildings');
    }

    return response.text();
  },

  // Cập nhật phòng ban của nhân viên
  async updateEmployeeDepartments(maNV: number, departmentIds: number[],token: string): Promise<any> {
    

    const queryParams = new URLSearchParams();
    queryParams.append('maNV', maNV.toString());
    departmentIds.forEach(id => queryParams.append('danhSachMaPB', id.toString()));

    const response = await fetch(`${API_BASE_URL}/NhanVien/UpdateNhanVienInPhongBan?${queryParams}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update employee departments');
    }

    return response.json();
  },

  // Cập nhật role của nhân viên
  async updateEmployeeRoles(maNV: number, roleIds: number[],token: string): Promise<any> {



    const response = await fetch(`${API_BASE_URL}/NhanVien/UpdateNhanVienRole`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to update employee roles');
    }

    return response.json();
  },
};