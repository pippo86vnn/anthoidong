import React, { useState } from 'react';
import { PhanAnhItem, TrangThaiPhanAnh, DANH_MUC_LIST, KHU_PHO_LIST } from '../types';
import { ShieldCheck, Lock, RefreshCw, Edit3, Search, AlertCircle, CheckCircle2, Clock, Upload } from 'lucide-react';

interface AdminPanelProps {
  items: PhanAnhItem[];
  onUpdateItem: (id: string, newStatus: TrangThaiPhanAnh, adminReply: string, canBoXuLy: string, hinhAnhXuLy: string) => void;
  onOpenImageModal: (url: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ items, onUpdateItem, onOpenImageModal }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [khuPhoFilter, setKhuPhoFilter] = useState('');
  const [danhMucFilter, setDanhMucFilter] = useState('');

  // Modal Editing State
  const [editingItem, setEditingItem] = useState<PhanAnhItem | null>(null);
  const [editStatus, setEditStatus] = useState<TrangThaiPhanAnh>('Mới tiếp nhận');
  const [editReply, setEditReply] = useState('');
  const [editCanBo, setEditCanBo] = useState('');
  const [editHinhAnhXuLy, setEditHinhAnhXuLy] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '123456' || pin === 'admin' || pin === 'tanthuan') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleOpenEdit = (item: PhanAnhItem) => {
    setEditingItem(item);
    setEditStatus(item.trangThai);
    setEditReply(item.phanHoiAdmin || '');
    setEditCanBo(item.canBoXuLy || '');
    setEditHinhAnhXuLy(item.hinhAnhXuLy || '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setEditHinhAnhXuLy(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Lỗi khi đọc file ảnh.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    onUpdateItem(editingItem.id, editStatus, editReply.trim(), editCanBo, editHinhAnhXuLy);
    setEditingItem(null);
  };

  const filteredItems = items.filter((item) => {
    const kw = searchFilter.toLowerCase().trim();
    const matchKw =
      !kw ||
      item.id.toLowerCase().includes(kw) ||
      item.nguoiGui.toLowerCase().includes(kw) ||
      item.soDienThoai.toLowerCase().includes(kw) ||
      item.noiDung.toLowerCase().includes(kw) ||
      item.khuPho.toLowerCase().includes(kw);

    const matchSt = !statusFilter || item.trangThai === statusFilter;
    const matchKp = !khuPhoFilter || item.khuPho === khuPhoFilter;
    const matchDm = !danhMucFilter || item.danhMuc === danhMucFilter;
    
    return matchKw && matchSt && matchKp && matchDm;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 sm:p-8 text-center space-y-5">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
          <Lock className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Xác thực Quản trị viên</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Giao diện dành riêng cho Cán bộ UBND Xã An Thới Đông để cập nhật tiến độ xử lý Google Sheet
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              placeholder="Nhập mã PIN (Mặc định: 123456)"
              className={`w-full text-center text-lg font-mono tracking-widest py-3 px-4 bg-slate-50 dark:bg-slate-900 border rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 ${
                pinError ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-300 dark:border-slate-600 focus:ring-amber-500'
              }`}
            />
            {pinError && (
              <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Mã PIN không hợp lệ! Hãy thử 123456
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg text-sm"
          >
            Đăng Nhập Quản Trị
          </button>
        </form>

        <p className="text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-3">
          💡 Mã PIN demo mặc định là <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">123456</code>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                CÁN BỘ XÃ AN THỚI ĐÔNG
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Đã đồng bộ Google Sheet tab <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-700 dark:text-slate-300">DuLieuPhanAnh</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm ID, SĐT..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800"
            />
          </div>

          <select
            value={khuPhoFilter}
            onChange={(e) => setKhuPhoFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="">Tất cả Ấp</option>
            {KHU_PHO_LIST.map((kp) => (
              <option key={kp} value={kp}>{kp}</option>
            ))}
          </select>
          
          <select
            value={danhMucFilter}
            onChange={(e) => setDanhMucFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="">Tất cả Lĩnh vực</option>
            {DANH_MUC_LIST.map((dm) => (
              <option key={dm} value={dm}>{dm}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="Mới tiếp nhận">🔴 Mới</option>
            <option value="Đang xử lý">🟡 Xử lý</option>
            <option value="Đã hoàn thành">🟢 Xong</option>
          </select>
        </div>
      </div>

      {/* Admin Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Mã ID</th>
                <th className="p-3.5">Thời Gian</th>
                <th className="p-3.5">Người Gửi / SĐT</th>
                <th className="p-3.5">Ấp</th>
                <th className="p-3.5">Danh Mục & Nội Dung</th>
                <th className="p-3.5">Trạng Thái</th>
                <th className="p-3.5">Cán Bộ Phản Hồi</th>
                <th className="p-3.5 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    Không có phản ánh nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="hover:bg-slate-50 dark:bg-slate-900/80 transition">
                    <td className="p-3.5 font-mono font-bold text-sky-800 whitespace-nowrap">
                      ...{item.id.slice(-3)}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                      {item.thoiGian.match(/\d{1,2}\/\d{1,2}\/\d{4}/)?.[0] || item.thoiGian.split(' ')[0]}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{item.nguoiGui}</div>
                      <div className="text-[11px] font-mono text-slate-400">{item.soDienThoai}</div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                      📍 {item.khuPho}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <div className="font-semibold text-sky-700 mb-0.5">🏷️ {item.danhMuc}</div>
                      <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{item.noiDung}</p>
                      {item.hinhAnh && (
                        <button
                          type="button"
                          onClick={() => onOpenImageModal(item.hinhAnh)}
                          className="text-[11px] text-sky-600 hover:underline mt-1 block"
                        >
                          📷 Xem ảnh đính kèm
                        </button>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      {item.trangThai === 'Mới tiếp nhận' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                          🔴 Mới tiếp nhận
                        </span>
                      )}
                      {item.trangThai === 'Đang xử lý' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          🟡 Đang xử lý
                        </span>
                      )}
                      {item.trangThai === 'Đã hoàn thành' && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          🟢 Đã hoàn thành
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-xs">
                      {item.phanHoiAdmin ? (
                        <div className="text-slate-700 dark:text-slate-300 bg-sky-50 p-2 rounded-lg border border-sky-100 text-[11px]">
                          <p className="line-clamp-3">{item.phanHoiAdmin}</p>
                          {item.canBoXuLy && (
                            <p className="text-sky-700 font-semibold mt-1">👤 {item.canBoXuLy}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-[11px]">Chưa phản hồi</span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-xs transition text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Xử lý
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL FOR OFFICIALS */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Cập nhật phản ánh hạ tầng</h3>
                <p className="text-xs text-slate-500 font-mono">Mã: {editingItem.id}</p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-400 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Readonly details */}
            <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div><strong>Người gửi:</strong> {editingItem.nguoiGui} ({editingItem.soDienThoai}) - {editingItem.khuPho}</div>
              <div><strong>Danh mục:</strong> {editingItem.danhMuc}</div>
              <div className="text-slate-600 dark:text-slate-400 italic">"{editingItem.noiDung}"</div>
            </div>

            {/* Select Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Cập nhật Trạng thái <span className="text-rose-500">*</span>
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as TrangThaiPhanAnh)}
                className="w-full text-xs font-bold py-2.5 px-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500"
              >
                <option value="Mới tiếp nhận">🔴 Mới tiếp nhận</option>
                <option value="Đang xử lý">🟡 Đang xử lý</option>
                <option value="Đã hoàn thành">🟢 Đã hoàn thành</option>
              </select>
            </div>

            {/* Admin Response Text */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                Nội dung cán bộ trả lời người dân
              </label>
              <textarea
                rows={4}
                value={editReply}
                onChange={(e) => setEditReply(e.target.value)}
                placeholder="Nhập phương án xử lý, đơn vị phụ trách, dự kiến ngày hoàn thành..."
                className="w-full text-xs p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Select Cán bộ xử lý */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Cán bộ xử lý
              </label>
              <select
                value={editCanBo}
                onChange={(e) => setEditCanBo(e.target.value)}
                className="w-full text-xs font-bold py-2.5 px-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500"
              >
                <option value="">-- Chọn cán bộ --</option>
                <option value="Phạm Chí Trung">Phạm Chí Trung</option>
                <option value="Nguyễn Hoàng Minh">Nguyễn Hoàng Minh</option>
              </select>
            </div>

            {/* Upload Ảnh đã xử lý */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Đính kèm ảnh đã xử lý (Tùy chọn)
              </label>
              <div className="flex items-center gap-4">
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition ${isUploading ? 'opacity-50' : ''}`}>
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {isUploading ? 'Đang xử lý...' : 'Chọn ảnh thực tế'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>

              {editHinhAnhXuLy && (
                <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 inline-block relative">
                  <button 
                    type="button" 
                    onClick={() => setEditHinhAnhXuLy('')}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <img
                    src={editHinhAnhXuLy}
                    alt="Xem trước"
                    className="h-24 object-contain rounded-lg border border-slate-300 dark:border-slate-600 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 rounded-xl transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition shadow-md"
              >
                Lưu Cập Nhật Về Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
