import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';

export interface ImageUploadProps {
  id?: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  variant?: 'logo' | 'cover';
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
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try again.');
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isCover = variant === 'cover';

  return (
    <div className="space-y-1.5" id={id}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
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

      {sublabel && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
          {sublabel}
        </p>
      )}

      {/* Hidden file input */}
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
          className={`relative rounded-2xl border border-teal-200 dark:border-teal-800 bg-slate-50 dark:bg-slate-800/80 overflow-hidden group ${
            isCover ? 'h-28 w-full' : 'h-24 w-24'
          }`}
        >
          <img
            src={value}
            alt="Uploaded Preview"
            className={`w-full h-full object-cover transition-transform group-hover:scale-105 duration-200 ${
              !isCover ? 'rounded-2xl' : ''
            }`}
          />
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white rounded-lg text-[10px] font-bold shadow-xs hover:bg-white cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs cursor-pointer"
              title="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
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
              : 'border-slate-300 dark:border-slate-700 hover:border-teal-600 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 bg-white/50 dark:bg-slate-850'
          } ${isCover ? 'h-24 w-full' : 'h-24 w-full sm:w-48'}`}
        >
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-1 border border-teal-200 dark:border-teal-800">
            {isDragging ? <Upload className="w-4 h-4 animate-bounce" /> : <ImageIcon className="w-4 h-4" />}
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {isDragging ? 'Drop photo here' : 'Upload or Drag & Drop'}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
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
