import React, { useState } from 'react';
import { DANH_MUC_LIST, KHU_PHO_LIST, DanhMucPhanAnh, PhanAnhItem } from '../types';
import { Send, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, Building2, ShieldAlert, HeartHandshake, FileText, Users, HelpCircle, ArrowLeft, MapPin, Upload } from 'lucide-react';

interface CitizenFormProps {
  onSubmit: (newItem: PhanAnhItem) => Promise<string | undefined>;
  onSuccessNavigate: () => void;
}

const CATEGORY_CARDS: { id: DanhMucPhanAnh; title: string; icon: any; color: string; bgColor: string; borderColor: string }[] = [
  { id: 'Kinh tế, Hạ tầng và Đô thị', title: 'Kinh tế, Hạ tầng và Đô thị', icon: Building2, color: 'text-sky-600', bgColor: 'bg-sky-50 hover:bg-sky-100', borderColor: 'border-sky-200' },
  { id: 'An ninh trật tự', title: 'An ninh trật tự', icon: ShieldAlert, color: 'text-rose-600', bgColor: 'bg-rose-50 hover:bg-rose-100', borderColor: 'border-rose-200' },
  { id: 'Văn hóa - Xã hội', title: 'Văn hóa - Xã hội', icon: HeartHandshake, color: 'text-amber-600', bgColor: 'bg-amber-50 hover:bg-amber-100', borderColor: 'border-amber-200' },
  { id: 'Cải cách hành chính', title: 'Cải cách hành chính', icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50 hover:bg-indigo-100', borderColor: 'border-indigo-200' },
  { id: 'Chia sẻ cộng đồng ấp', title: 'Chia sẻ cộng đồng ấp', icon: Users, color: 'text-emerald-600', bgColor: 'bg-emerald-50 hover:bg-emerald-100', borderColor: 'border-emerald-200' },
  { id: 'Khác', title: 'Khác', icon: HelpCircle, color: 'text-purple-600', bgColor: 'bg-purple-50 hover:bg-purple-100', borderColor: 'border-purple-200' },
];

export const CitizenForm: React.FC<CitizenFormProps> = ({ onSubmit, onSuccessNavigate }) => {
  const [nguoiGui, setNguoiGui] = useState('');
  const [soDienThoai, setSoDienThoai] = useState('');
  const [khuPho, setKhuPho] = useState('Ấp 1');
  const [danhMuc, setDanhMuc] = useState<DanhMucPhanAnh | ''>('');
  const [noiDung, setNoiDung] = useState('');
  const [hinhAnh, setHinhAnh] = useState('');
  const [viTri, setViTri] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị.');
      return;
    }
    
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setViTri(`https://www.google.com/maps?q=${lat},${lng}`);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert('Không thể lấy được vị trí. Vui lòng kiểm tra lại quyền định vị (Location) trên trình duyệt hoặc thiết bị của bạn.');
        setIsGettingLocation(false);
      }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setHinhAnh(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Lỗi khi đọc file ảnh.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleQuickDemo = () => {
    setNguoiGui('Trần Hoàng Nam');
    setSoDienThoai('0909888777');
    setKhuPho('Ấp 2');
    setDanhMuc('Kinh tế, Hạ tầng và Đô thị');
    setNoiDung('Nắp hố ga thoát nước trước nhà số 245 Cao Văn Lầu bị bể vỡ bê tông, miệng hố ga hở rộng rất nguy hiểm cho trẻ em và xe máy qua lại.');
    setHinhAnh('');
    setViTri('10.7469, 106.7441');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nguoiGui.trim() || !soDienThoai.trim() || !noiDung.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullTimestamp = `${dateStr} ${timeStr}`;

    const dateCode = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(100 + Math.random() * 900);
    const fallbackId = `PA${dateCode}-${randomNum}`;

    const finalNoiDung = viTri ? `${noiDung}\n\n📍 Vị trí định vị: ${viTri}` : noiDung;

    const newItem: PhanAnhItem = {
      id: fallbackId,
      thoiGian: fullTimestamp,
      nguoiGui: nguoiGui.trim(),
      soDienThoai: soDienThoai.trim(),
      khuPho,
      danhMuc: danhMuc as DanhMucPhanAnh,
      noiDung: finalNoiDung.trim(),
      hinhAnh: hinhAnh.trim(),
      trangThai: 'Mới tiếp nhận',
      phanHoiAdmin: '',
      ngayCapNhat: fullTimestamp
    };

    try {
      const realId = await onSubmit(newItem);
      setSubmittedId(realId || fallbackId);
    } catch (error) {
      console.error(error);
      setSubmittedId(fallbackId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setNguoiGui('');
    setSoDienThoai('');
    setKhuPho('Ấp 1');
    setDanhMuc('');
    setNoiDung('');
    setHinhAnh('');
    setSubmittedId(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {submittedId ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 shadow-md p-6 sm:p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">GỬI PHẢN ÁNH THÀNH CÔNG!</h3>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Mã phản ánh của bạn là: <span className="font-mono font-bold text-sky-700 text-base bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">{submittedId}</span>
            </p>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Ủy ban MTTQ Việt Nam Xã An Thới Đông đã ghi nhận thông tin. Bạn có thể tra cứu tiến độ xử lý bất kỳ lúc nào bằng Số điện thoại hoặc Mã ID.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onSuccessNavigate}
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-sm"
            >
              Xem Danh Sách & Lịch Sử
            </button>
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs sm:text-sm transition"
            >
              Tạo phản ánh mới
            </button>
          </div>
        </div>
      ) : !danhMuc ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📋</span> Chọn danh mục phản ánh
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">Vui lòng chọn loại sự cố bạn muốn phản ánh để tiếp tục</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORY_CARDS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setDanhMuc(cat.id)}
                className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border transition cursor-pointer ${cat.bgColor} ${cat.borderColor} group`}
              >
                <div className={`p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm mb-3 group-hover:scale-110 transition-transform ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{cat.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
            <div>
              <button
                type="button"
                onClick={() => setDanhMuc('')}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-300 text-sm mb-2 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại chọn danh mục
              </button>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📝</span> Nhập thông tin phản ánh
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Danh mục: <span className="font-semibold text-sky-700">{danhMuc}</span>. Vui lòng điền đầy đủ thông tin bên dưới (* bắt buộc)
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 font-medium transition flex items-center gap-1"
            >
              <span>⚡ Mẫu nhập thử</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Thông tin người gửi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Họ và tên người dân <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nguoiGui}
                  onChange={(e) => setNguoiGui(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={soDienThoai}
                  onChange={(e) => setSoDienThoai(e.target.value)}
                  placeholder="Ví dụ: 0903123456"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition"
                />
              </div>
            </div>

            {/* Khu phố */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
                Địa bàn Ấp (1 - 8) <span className="text-rose-500">*</span>
              </label>
              <select
                value={khuPho}
                onChange={(e) => setKhuPho(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 text-sm transition"
              >
                {KHU_PHO_LIST.map((kp) => (
                  <option key={kp} value={kp}>
                    📍 {kp}
                  </option>
                ))}
              </select>
            </div>

            {/* Nội dung chi tiết */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Nội dung góp ý, kiến nghị <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                placeholder="Mô tả thông tin góp ý kiến nghị..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl focus:bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 text-sm transition"
              />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isGettingLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-sky-50 dark:bg-slate-800 text-sky-700 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-slate-700 rounded-lg border border-sky-200 dark:border-slate-600 transition disabled:opacity-50"
                >
                  <MapPin className="w-4 h-4" />
                  {isGettingLocation ? 'Đang lấy vị trí...' : '📍 Gửi kèm vị trí hiện tại'}
                </button>
                {viTri && (
                  <a 
                    href={viTri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 transition truncate max-w-[200px]"
                    title={viTri}
                  >
                    ✅ Đã lấy được vị trí
                  </a>
                )}
              </div>
            </div>

            {/* Đính kèm ảnh */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                Đính kèm ảnh thực tế (Tùy chọn)
              </label>
              
              <div className="flex items-center gap-4">
                <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition ${isUploading ? 'opacity-50' : ''}`}>
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {isUploading ? 'Đang xử lý...' : 'Chọn ảnh từ thiết bị'}
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

              {/* Image Preview if provided */}
              {hinhAnh && (
                <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 inline-block relative">
                  <button 
                    type="button" 
                    onClick={() => setHinhAnh('')}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <img
                    src={hinhAnh}
                    alt="Xem trước"
                    className="h-32 object-contain rounded-lg border border-slate-300 dark:border-slate-600 bg-white"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang lưu vào Google Sheet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Góp ý, Phản ánh</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
