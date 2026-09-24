import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Check, AlertCircle, Link as LinkIcon } from 'lucide-react';

export interface ImageUploadProps {
  id?: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  variant?: 'logo' | 'cover' | 'product';
  presets?: { name: string; url: string }[];
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  id,
  label,
  sublabel,
  value,
  onChange,
  variant = 'logo',
  presets,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    setErrorMessage('');
    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WebP, SVG, GIF)');
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const rawData = reader.result;
        // Keep SVGs untouched
        if (file.type === 'image/svg+xml') {
          onChange(rawData);
          return;
        }

        // Optimize raster images using Canvas to stay safely below 35KB for database & sheets sync
        const img = new Image();
        img.onload = () => {
          const maxDim = variant === 'logo' ? 300 : variant === 'cover' ? 600 : 500;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            let optimized = canvas.toDataURL('image/jpeg', 0.78);
            // Guarantee string length is safely under Google Sheets 45,000 char cell limit and localStorage limits
            if (optimized.length > 40000) {
              optimized = canvas.toDataURL('image/jpeg', 0.65);
            }
            if (optimized.length > 40000) {
              optimized = canvas.toDataURL('image/jpeg', 0.52);
            }
            onChange(optimized);
          } else {
            onChange(rawData);
          }
        };
        img.onerror = () => {
          onChange(rawData);
        };
        img.src = rawData;
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file from your computer. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setErrorMessage('');
    setManualUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setShowUrlInput(false);
    setErrorMessage('');
  };

  const isCover = variant === 'cover';
  const isProduct = variant === 'product';

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : 'Link URL'}</span>
          </button>
          {presets && presets.length > 0 && (
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-[11px] text-teal-700 dark:text-teal-300 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>{showPresets ? 'Hide Samples' : 'Choose Sample'}</span>
            </button>
          )}
        </div>
      </div>

      {sublabel && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {sublabel}
        </p>
      )}

      {/* Hidden file input for native file browser dialog */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleInputChange}
        className="hidden"
        id={`${id || 'img'}-file-input`}
      />

      {/* Upload Box or Image Preview */}
      {value ? (
        <div
          className={`relative rounded-2xl border-2 border-teal-500/40 dark:border-teal-600/40 bg-slate-50 dark:bg-slate-800/80 overflow-hidden group shadow-xs ${
            isCover ? 'h-32 w-full' : isProduct ? 'h-40 w-full sm:w-64' : 'h-24 w-24'
          }`}
        >
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-white text-slate-900 rounded-xl text-[11px] font-bold shadow-md hover:bg-slate-100 cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-3 h-3 text-teal-700" />
              <span>Upload New</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
            <span>Uploaded</span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center p-3 text-center ${
            isDragging
              ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 hover:border-teal-600 hover:bg-teal-50/20 dark:hover:bg-teal-950/20 bg-white/70 dark:bg-slate-800/70'
          } ${isCover ? 'h-28 w-full' : isProduct ? 'h-36 w-full sm:w-64' : 'h-24 w-full sm:w-48'}`}
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-1.5 border border-teal-200 dark:border-teal-800 shadow-2xs">
            {isDragging ? <Upload className="w-4 h-4 animate-bounce" /> : <Upload className="w-4 h-4" />}
          </div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {isDragging ? 'Drop photo here' : 'Upload from Local Computer'}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click to browse files or drag & drop (JPEG, PNG, WebP up to 5MB)
          </p>
        </div>
      )}

      {/* URL Direct Link Input Toggle */}
      {showUrlInput && (
        <form onSubmit={handleApplyUrl} className="flex items-center gap-2 mt-2 animate-fadeIn">
          <input
            type="url"
            placeholder="Paste direct image URL (https://...)"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-600"
          />
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
          >
            Apply URL
          </button>
        </form>
      )}

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Preset selection dropdown / grid */}
      {showPresets && presets && presets.length > 0 && (
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2 mt-1 animate-fadeIn">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Or select authentic Bhutanese sample:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                  setErrorMessage('');
                }}
                className={`group relative rounded-lg overflow-hidden border text-left p-1 cursor-pointer transition-all ${
                  value === preset.url
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-teal-400 bg-white dark:bg-slate-900'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-12 object-cover rounded-md mb-1"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {preset.name}
                  </span>
                  {value === preset.url && <Check className="w-3 h-3 text-teal-600 shrink-0" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
