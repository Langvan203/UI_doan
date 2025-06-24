export interface NhanVienInYeuCau {
  maNV: number;
  tenNV: string;
}

export interface YeuCauSuaChuaDTO {
  tieuDe: string;
  maYC: number;
  maTN: number;
  maKN: number;
  maTL: number;
  maMB: number;
  tenTN: string;
  tenKN: string;
  tenTL: string;
  maVT: string;

  maKH: number;
  tenKH: string;

  ngayYeuCau: string; // hoặc Date nếu bạn muốn dùng kiểu Date trong JS

  mucDoYeuCau?: number | null;

  idTrangThai: number;
  tenTrangThai: string;

  nguoiYeuCau: string;
  moTa: string;

  imagePath?: string | null;
  ghiChu?: string | null;

  maHeThong: number;
  tenHeThong: string;

  nhanVienInYeuCaus: NhanVienInYeuCau[];
}
export interface GetYeuCauSuaChuaPaged {
  data: YeuCauSuaChuaDTO[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface StatusMaintanceRequest {
  maTrangThai: number;
  tenTrangThai: string;
}

export interface GiaoViecYeuCauChoNhanVien {
  maYC: number;
  danhSachNhanVien: number[];
  isSendNotification: boolean;
}