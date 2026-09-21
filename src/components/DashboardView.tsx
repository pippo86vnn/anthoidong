import React, { useState, useEffect } from 'react';
import { PhanAnhItem, DANH_MUC_LIST, DanhMucPhanAnh } from '../types';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Clock, MapPin, Flame, Award, Image as ImageIcon } from 'lucide-react';

interface DashboardViewProps {
  items: PhanAnhItem[];
}

const CATEGORY_COLORS: Record<DanhMucPhanAnh, string> = {
  'Kinh tế, Hạ tầng và Đô thị': '#0284c7', // Sky blue
  'An ninh trật tự': '#e11d48', // Rose
  'Văn hóa - Xã hội': '#f59e0b', // Amber
  'Cải cách hành chính': '#6366f1', // Indigo
  'Chia sẻ cộng đồng ấp': '#10b981', // Emerald
  'Khác': '#8b5cf6', // Purple
};

const AnimatedNumber = ({ value, duration = 4000 }: { value: number; duration?: number }) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setCurrentValue(0);
      return;
    }
    
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      
      setCurrentValue(Math.floor(value * easeOutQuart));
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{currentValue}</>;
};

export const DashboardView: React.FC<DashboardViewProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const total = items.length;
  const newCount = items.filter((x) => x.trangThai === 'Mới tiếp nhận').length;
  const processCount = items.filter((x) => x.trangThai === 'Đang xử lý').length;
  const doneCount = items.filter((x) => x.trangThai === 'Đã hoàn thành').length;
  const resolutionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // Category statistics data for Pie Chart
  const categoryData = DANH_MUC_LIST.map((dm) => {
    const count = items.filter((x) => x.danhMuc === dm).length;
    return {
      name: dm,
      value: count,
      color: CATEGORY_COLORS[dm]
    };
  }).filter((x) => x.value > 0);

  // Top Neighborhoods Hotspot data for Bar Chart
  const neighborhoodMap: Record<string, number> = {};
  items.forEach((item) => {
    neighborhoodMap[item.khuPho] = (neighborhoodMap[item.khuPho] || 0) + 1;
  });

  const hotspotData = Object.entries(neighborhoodMap)
    .map(([khuPho, count]) => ({ khuPho, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  // Drilldown data for selected category
  const drilldownMap: Record<string, number> = {};
  if (selectedCategory) {
    items.filter(item => item.danhMuc === selectedCategory).forEach(item => {
      drilldownMap[item.khuPho] = (drilldownMap[item.khuPho] || 0) + 1;
    });
  }
  const drilldownData = Object.entries(drilldownMap)
    .map(([khuPho, count]) => ({ khuPho, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Show top 10

  // Urgent pending items feed
  const urgentPendingItems = items
    .filter((x) => x.trangThai === 'Mới tiếp nhận')
    .slice(0, 4);
    
  // Completed items with images
  const completedWithImages = items
    .filter((x) => x.trangThai === 'Đã hoàn thành' && ((x.hinhAnhXuLy && x.hinhAnhXuLy.length > 10) || (x.hinhAnh && x.hinhAnh.length > 10)))
    .slice(0, 4);

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
      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Tổng phản ánh</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1"><AnimatedNumber value={total} /></h3>
            <p className="text-[11px] text-slate-500 mt-1">Toàn Xã An Thới Đông</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center text-xl font-bold">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-rose-600">Mới tiếp nhận</p>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-700 mt-1"><AnimatedNumber value={newCount} /></h3>
            <p className="text-[11px] text-rose-600/80 mt-1">Cần khảo sát ngay</p>
          </div>
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-amber-600">Đang xử lý</p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-700 mt-1"><AnimatedNumber value={processCount} /></h3>
            <p className="text-[11px] text-amber-600/80 mt-1">Đang tiếp nhận</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-emerald-600">Đã hoàn thành</p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1"><AnimatedNumber value={doneCount} /></h3>
            <p className="text-[11px] text-emerald-600/80 mt-1">Đã hoàn thành</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div>
            <p className="text-xs font-semibold uppercase text-sky-600">Tỉ lệ giải quyết</p>
            <h3 className="text-2xl sm:text-3xl font-black text-sky-800 mt-1"><AnimatedNumber value={resolutionRate} />%</h3>
            <p className="text-[11px] text-sky-600/80 mt-1">Chỉ số hoàn thành</p>
          </div>
          <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Completed with images */}
      {completedWithImages.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              Những sự cố đã xử lý thành công (Có hình ảnh)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {completedWithImages.map((item, index) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="h-32 bg-slate-100 dark:bg-slate-900 relative">
                  <img src={item.hinhAnhXuLy || item.hinhAnh} alt={item.noiDung} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 shadow-sm">
                    Đã hoàn thành
                  </div>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800 flex-1">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{item.danhMuc}</p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-600" /> {item.khuPho}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 italic">"{item.noiDung}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 text-sky-700">📊</span>
              Phân bổ phản ánh theo 6 Danh mục
            </h3>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="75%"
                  paddingAngle={4}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  className="text-[10px] cursor-pointer"
                  onClick={(data, index) => {
                    if (data && data.name) {
                      setSelectedCategory(selectedCategory === data.name ? null : data.name);
                    }
                  }}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity outline-none"
                      stroke={selectedCategory === entry.name ? '#333' : '#fff'}
                      strokeWidth={selectedCategory === entry.name ? 2 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} phản ánh`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Neighborhood Hotspots Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">🔥</span>
              Top 5 Ấp về lượng góp ý
            </h3>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="khuPho" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => [`${value} phản ánh`, 'Số lượng']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Số phản ánh" radius={[8, 8, 0, 0]}>
                  {hotspotData.map((entry, index) => {
                    const colors = ['#ef4444', '#f87171', '#ea580c', '#fb923c', '#3b82f6'];
                    return <Cell key={`cell-${index}`} fill={colors[index] || '#3b82f6'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Drilldown Category Chart */}
      {selectedCategory && (
        <div className="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-2xl border border-sky-200 dark:border-sky-800 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="p-1.5 rounded-lg text-white" style={{ backgroundColor: CATEGORY_COLORS[selectedCategory] || '#0ea5e9' }}>
                <Activity className="w-4 h-4" />
              </span>
              Chi tiết: {selectedCategory} theo Ấp
            </h3>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              Đóng chi tiết
            </button>
          </div>

          {drilldownData.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-10">Không có dữ liệu cho danh mục này.</p>
          ) : (
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={drilldownData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="khuPho" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value} trường hợp`, 'Số lượng']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" name="Số phản ánh" radius={[0, 8, 8, 0]} fill={CATEGORY_COLORS[selectedCategory] || '#0ea5e9'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Priority Alert List for Pending Items */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
            Danh sách góp ý mới tiếp nhận
          </h3>
          <span className="text-xs bg-rose-100 text-rose-700 font-bold px-2.5 py-0.5 rounded-full">
            {newCount} sự cố chờ cán bộ
          </span>
        </div>

        {urgentPendingItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">
            Tuyệt vời! Hiện tại không có sự cố tồn đọng mới tiếp nhận.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentPendingItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-bold text-rose-900">
                  <span className="font-mono bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                    {item.id}
                  </span>
                  <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-normal text-[11px]">
                    <MapPin className="w-3 h-3 text-rose-600" /> {item.khuPho}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  🏷️ {item.danhMuc} - Người gửi: {maskName(item.nguoiGui)} ({maskPhone(item.soDienThoai)})
                </div>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 italic">"{item.noiDung}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
