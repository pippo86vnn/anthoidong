export type TrangThaiPhanAnh = 'Mới tiếp nhận' | 'Đang xử lý' | 'Đã hoàn thành';

export type DanhMucPhanAnh =
  | 'Kinh tế, Hạ tầng và Đô thị'
  | 'An ninh trật tự'
  | 'Văn hóa - Xã hội'
  | 'Cải cách hành chính'
  | 'Chia sẻ cộng đồng ấp'
  | 'Khác';

export interface PhanAnhItem {
  id: string;             // Cột A: ID
  thoiGian: string;       // Cột B: ThoiGian
  nguoiGui: string;       // Cột C: NguoiGui
  soDienThoai: string;    // Cột D: SoDienThoai
  khuPho: string;         // Cột E: KhuPho (Ấp 1 - Ấp 8)
  danhMuc: DanhMucPhanAnh;// Cột F: DanhMuc
  noiDung: string;        // Cột G: NoiDung
  hinhAnh: string;        // Cột H: HinhAnh (URL/Base64)
  trangThai: TrangThaiPhanAnh; // Cột I: TrangThai
  phanHoiAdmin: string;   // Cột J: PhanHoiAdmin
  ngayCapNhat: string;    // Cột K: NgayCapNhat
  canBoXuLy?: string;     // Cán bộ xử lý (Lê Võ Đăng Khoa, Ngô Hoàng Quý)
  hinhAnhXuLy?: string;   // Hình ảnh cán bộ đã xử lý
}

export const DANH_MUC_LIST: DanhMucPhanAnh[] = [
  'Kinh tế, Hạ tầng và Đô thị',
  'An ninh trật tự',
  'Văn hóa - Xã hội',
  'Cải cách hành chính',
  'Chia sẻ cộng đồng ấp',
  'Khác'
];

// Tạo danh sách 8 Ấp (Ấp 1 -> Ấp 8)
export const KHU_PHO_LIST: string[] = Array.from({ length: 8 }, (_, i) => `Ấp ${i + 1}`);

export type TabType = 'citizen_submit' | 'public_list' | 'admin_manage' | 'dashboard';
