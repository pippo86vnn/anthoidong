import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
          <span className="text-xs font-semibold text-slate-300">Hình ảnh minh họa thực địa</span>
          <div className="flex items-center gap-3">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:underline flex items-center gap-1"
            >
              Mở link gốc <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex items-center justify-center bg-black/50 min-h-[300px]">
          <img
            src={imageUrl}
            alt="Hình ảnh phản ánh"
            className="max-h-[70vh] object-contain rounded-lg border border-slate-800"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Loi+Khong+Tai+Duoc+Anh';
            }}
          />
        </div>
      </div>
    </div>
  );
};
