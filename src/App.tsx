import React, { useState, useEffect } from 'react';
import { TabType, PhanAnhItem, TrangThaiPhanAnh } from './types';
import { INITIAL_PHAN_ANH_DATA } from './data/initialData';
import { Header } from './components/Header';
import { CitizenForm } from './components/CitizenForm';
import { PublicList } from './components/PublicList';
import { AdminPanel } from './components/AdminPanel';
import { DashboardView } from './components/DashboardView';
import { ImageModal } from './components/ImageModal';
import { RotateCcw, Heart, Building, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'phan_anh_tan_thuan_items_v1';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwfwGys0ShHpGCokomefdPTWIwIQOy2vR4sOFeIDSIh-hD5zHggnUpBJ2KASi8MuShi/exec';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [items, setItems] = useState<PhanAnhItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState<'blue' | 'red'>('blue');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const fetchItems = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'getAll' }),
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setFetchError('Invalid data format received from server.');
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      setFetchError('Lỗi kết nối máy chủ Google Apps Script. Script có thể đang thiếu hàm doPost() để xử lý API, hoặc chưa được cấp quyền truy cập công khai.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleCreateItem = async (newItem: PhanAnhItem): Promise<string | undefined> => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'create', data: newItem }),
      });
      const result = await response.json();
      if (result.success) {
        newItem.id = result.id || newItem.id;
        setItems((prev) => [newItem, ...prev]);
        return newItem.id;
      } else {
        console.error('Failed to create:', result.message);
      }
    } catch (error) {
      console.error('Error creating data:', error);
    }
    return undefined;
  };

  const handleUpdateItem = async (id: string, newStatus: TrangThaiPhanAnh, adminReply: string, canBoXuLy: string = '', hinhAnhXuLy: string = '') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullTimestamp = `${dateStr} ${timeStr}`;

    // Optimistic UI update
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            trangThai: newStatus,
            phanHoiAdmin: adminReply,
            ngayCapNhat: fullTimestamp,
            canBoXuLy: canBoXuLy,
            hinhAnhXuLy: hinhAnhXuLy,
          };
        }
        return item;
      })
    );

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'updateAdmin', id: id, trangThai: newStatus, phanHoiAdmin: adminReply, canBoXuLy: canBoXuLy, hinhAnhXuLy: hinhAnhXuLy }),
      });
      const result = await response.json();
      if (!result.success) {
        console.error('Failed to update:', result.message);
        // Refresh to revert optimistic update if needed
        fetchItems();
      }
    } catch (error) {
      console.error('Error updating data:', error);
      fetchItems();
    }
  };

  const handleResetData = () => {
    fetchItems();
  };

  const completedCount = items.filter((x) => x.trangThai === 'Đã hoàn thành').length;

  return (
    <div className={`min-h-screen flex flex-col font-sans antialiased ${isDarkMode ? 'dark bg-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white' : 'bg-slate-100/70 text-slate-800 selection:bg-sky-500 selection:text-white'}`}>
      {/* Header & Tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={items.length}
        completedCount={completedCount}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {fetchError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl shadow-sm text-sm font-medium">
            ⚠️ {fetchError}
            <div className="mt-2 text-xs font-normal text-rose-600 space-y-1">
              <p>1. Hãy kiểm tra lại file Code.gs của dự án Google Apps Script, đảm bảo bạn đã thêm hàm <code>doPost(e)</code>.</p>
              <p>2. Chọn <strong>Deploy &gt; Manage deployments</strong>, nhấn vào biểu tượng cây bút chì, chọn <strong>New version</strong> và nhấn Deploy.</p>
            </div>
          </div>
        )}

        {activeTab === 'citizen_submit' && (
          <CitizenForm
            onSubmit={handleCreateItem}
            onSuccessNavigate={() => setActiveTab('public_list')}
          />
        )}

        {activeTab === 'public_list' && (
          <PublicList
            items={items}
            onOpenImageModal={(url) => setSelectedImageUrl(url)}
          />
        )}

        {activeTab === 'admin_manage' && (
          <AdminPanel
            items={items}
            onUpdateItem={handleUpdateItem}
            onOpenImageModal={(url) => setSelectedImageUrl(url)}
          />
        )}

        {activeTab === 'dashboard' && <DashboardView items={items} />}
      </main>

      {/* Image Modal Preview */}
      <ImageModal
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />

      {/* Footer */}
      <footer className={`${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} border-t mt-12 text-xs py-6`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className={`flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            <Building className={`w-4 h-4 ${themeColor === 'red' ? 'text-red-600' : 'text-sky-600'}`} />
            <span>
              <strong>Hệ thống tiếp nhận ý kiến, kiến nghị của Đoàn viên, Hội viên và nhân dân Xã An Thới Đông</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className={`${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} flex items-center gap-1 transition`}
              title="Tải lại dữ liệu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tải lại dữ liệu</span>
            </button>

            <span className={isDarkMode ? 'text-slate-700' : 'text-slate-300'}>|</span>

            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>
              Số điện thoại: 0377 783 877. Địa chỉ: Đường Lý Nhơn, ấp Lý Thái Bửu, xã An Thới Đông, TP. Hồ Chí Minh
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
