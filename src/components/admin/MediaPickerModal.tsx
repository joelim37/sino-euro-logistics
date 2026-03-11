"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Search, X } from "lucide-react";

interface MediaItem {
  name: string;
  path: string;
  url: string;
  folder: string;
}

interface MediaPickerModalProps {
  open: boolean;
  folder?: string;
  title?: string;
  actionLabel?: string;
  helperText?: string;
  selectedUrl?: string;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
}

export default function MediaPickerModal({
  open,
  folder = "all",
  title = "从媒体库选择图片",
  actionLabel = "应用图片",
  helperText = "选择后会直接应用到当前模块",
  selectedUrl,
  onClose,
  onSelect,
}: MediaPickerModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/upload?folder=${encodeURIComponent(folder)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "加载媒体库失败");
        setItems(data.items || []);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载媒体库失败");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, [open, folder]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.name.toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword));
  }, [items, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-navy">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索文件名..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200">{error}</div>}

          {isLoading ? (
            <div className="py-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" /></div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-gray-500">没有找到可用图片</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedUrl === item.url;

                return (
                  <div
                    key={item.path}
                    className={`group border rounded-2xl overflow-hidden transition-all bg-white ${isSelected ? "border-gold ring-2 ring-gold/20" : "border-gray-200 hover:border-gold hover:shadow-md"}`}
                  >
                    <div className="relative h-36 bg-gray-100">
                      <Image src={item.url} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white">{item.folder}</div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-green-600 bg-white rounded-full p-1 shadow">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3 space-y-3">
                      <div>
                        <div className="font-medium text-sm text-navy truncate">{item.name}</div>
                        <div className="text-xs text-gray-500 truncate mt-1">{item.path}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSelected ? "bg-green-50 text-green-700 border border-green-200" : "bg-navy text-white hover:bg-navy/90"}`}
                      >
                        {isSelected ? "当前已应用" : actionLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
