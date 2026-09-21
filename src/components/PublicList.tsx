import React, { useState } from 'react';
import { PhanAnhItem, KHU_PHO_LIST, DANH_MUC_LIST, TrangThaiPhanAnh } from '../types';
import { Search, Filter, Phone, MapPin, Calendar, CheckCircle2, Clock, AlertTriangle, Building, ExternalLink } from 'lucide-react';

interface PublicListProps {
  items: PhanAnhItem[];
  onOpenImageModal: (url: string) => void;
}

export const PublicList: React.FC<PublicListProps> = ({ items, onOpenImageModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKhuPho, setSelectedKhuPho] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      item.id.toLowerCase().includes(term) ||
      item.nguoiGui.toLowerCase().includes(term) ||
      item.soDienThoai.toLowerCase().includes(term) ||
      item.noiDung.toLowerCase().includes(term) ||
      item.khuPho.toLowerCase().includes(term);

    const matchesKp = !selectedKhuPho || item.khuPho === selectedKhuPho;
    const matchesSt = !selectedStatus || item.trangThai === selectedStatus;
    const matchesCat = !selectedCategory || item.danhMuc === selectedCategory;

    return matchesSearch && matchesKp && matchesSt && matchesCat;
  });

  const getStatusBadge = (status: TrangThaiPhanAnh) => {
    switch (status) {
      case 'Mới tiếp nhận':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3 h-3" /> Mới tiếp nhận
          </span>
        );
      case 'Đang xử lý':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Đang xử lý
          </span>
        );
      case 'Đã hoàn thành':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
          </span>
        );
    }
  };

  const maskName = (name: string) => {
    if (!name) return '***';
    return name.trim().split(' ').map(p => '*'.repeat(p.length)).join(' ');
  };

  const maskPhone = (phone: string) => {
    if (!phone) return '***';
    return '*'.repeat(phone.trim().length);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Danh sách phản ánh công khai
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Hệ thống theo dõi tiếp nhận ý kiến Xã An Thới Đông ({filteredItems.length} kết quả)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-2.5">
            {/* Search Box */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm SĐT, Tên, Mã ID..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 transition"
              />
            </div>

            {/* Khu phố Filter */}
            <select
              value={selectedKhuPho}
              onChange={(e) => setSelectedKhuPho(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">Tất cả Ấp (1 - 8)</option>
              {KHU_PHO_LIST.map((kp) => (
                <option key={kp} value={kp}>
                  {kp}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">Tất cả Danh mục</option>
              {DANH_MUC_LIST.map((dm) => (
                <option key={dm} value={dm}>
                  {dm}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="">Tất cả Trạng thái</option>
              <option value="Mới tiếp nhận">🔴 Mới tiếp nhận</option>
              <option value="Đang xử lý">🟡 Đang xử lý</option>
              <option value="Đã hoàn thành">🟢 Đã hoàn thành</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Feed Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-500 space-y-2">
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Không tìm thấy phản ánh nào phù hợp</p>
          <p className="text-xs text-slate-400">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition duration-200 p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-lg">
                      {item.id}
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-600" /> {item.khuPho}
                    </span>
                  </div>
                  {getStatusBadge(item.trangThai)}
                </div>

                {/* Category & Date */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                    🏷️ {item.danhMuc}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {item.thoiGian}
                  </span>
                </div>

                {/* Citizen Name & Phone */}
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span>👤 Người gửi: <strong>{maskName(item.nguoiGui)}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1 font-mono text-slate-500">
                    <Phone className="w-3 h-3 text-slate-400" /> {maskPhone(item.soDienThoai)}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  {item.noiDung}
                </p>

                {/* Image attachment thumbnail */}
                {item.hinhAnh && (
                  <div>
                    <button
                      type="button"
                      onClick={() => onOpenImageModal(item.hinhAnh)}
                      className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-800 font-medium hover:underline bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100"
                    >
                      📷 Xem ảnh chụp thực địa
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Official Reply Box */}
              {item.phanHoiAdmin ? (
                <div className="bg-sky-50/90 border border-sky-200/80 rounded-xl p-3.5 text-xs space-y-2">
                  <div className="flex items-center justify-between text-sky-900 font-bold">
                    <span className="flex items-center gap-1.5 text-sky-950">
                      <Building className="w-3.5 h-3.5 text-sky-700" />
                      Phản hồi từ Cán bộ UBND Xã:
                    </span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">{item.phanHoiAdmin}</p>
                  
                  {item.canBoXuLy && (
                    <div className="flex items-center gap-1 text-[11px] text-sky-800 font-medium">
                      <span>👤 Cán bộ xử lý: {item.canBoXuLy}</span>
                    </div>
                  )}

                  {item.hinhAnhXuLy && (
                    <div>
                      <button
                        type="button"
                        onClick={() => onOpenImageModal(item.hinhAnhXuLy!)}
                        className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 hover:text-emerald-900 font-medium hover:underline bg-emerald-100 px-2 py-1 rounded border border-emerald-200"
                      >
                        ✅ Xem ảnh đã xử lý
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="text-[10px] text-sky-700/80 text-right pt-1 border-t border-sky-200/50 mt-1.5">
                    Cập nhật lần cuối: {item.ngayCapNhat || item.thoiGian}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl p-2.5 text-[11px] text-slate-400 italic text-center">
                  ⏳ Chưa có phản hồi chính thức từ cán bộ chuyên trách Xã.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
