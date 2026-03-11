"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelectMedia?: (item: { name: string; path: string; url: string; folder: string }) => void;
  folder?: string;
  placeholder?: string;
  hint?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  onSelectMedia,
  folder = "general",
  placeholder = "请输入图片 URL 或上传本地图片",
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "上传失败");
      }

      onChange(data.url);
      onSelectMedia?.({ name: file.name, path: data.path, url: data.url, folder });
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>

        <div className="space-y-3">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="input-field"
            placeholder={placeholder}
          />

          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>从媒体库选择</span>
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? "上传中..." : "上传本地图片"}</span>
            </button>
            {hint && <span className="text-sm text-gray-500">{hint}</span>}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {value ? (
            <div className="relative w-full max-w-sm h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <Image src={value} alt={label} fill className="object-cover" />
            </div>
          ) : (
            <div className="w-full max-w-sm h-44 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-gray-50">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">暂未选择图片</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <MediaPickerModal
        open={showMediaPicker}
        folder={folder}
        title={`选择${label}`}
        onClose={() => setShowMediaPicker(false)}
        onSelect={(item) => {
          onChange(item.url);
          onSelectMedia?.(item);
          setShowMediaPicker(false);
        }}
      />
    </>
  );
}
