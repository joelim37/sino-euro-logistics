"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";

interface MediaItem {
  name: string;
  path: string;
  url: string;
  folder: string;
}

export default function MediaAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/upload");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "加载失败");
      setItems(data.items || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const upload = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "media-library");
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "上传失败");
      await fetchMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setIsUploading(false);
    }
  };

  const remove = async (path: string) => {
    if (!confirm("确定删除这张图片吗？")) return;
    const response = await fetch(`/api/admin/upload?path=${encodeURIComponent(path)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "删除失败");
      return;
    }
    await fetchMedia();
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("图片地址已复制");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-navy font-bold">媒体库</h1>
          <p className="text-gray-500 mt-1">统一管理站点图片素材，可复制地址到 Banner、服务、新闻等模块使用</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {isUploading ? "上传中..." : "上传图片"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          <button onClick={fetchMedia} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">{error}</div>}

      {isLoading ? (
        <div className="py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">媒体库暂时为空，先上传几张图片吧。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.path} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="relative h-52 bg-gray-100">
                <Image src={item.url} alt={item.name} fill className="object-cover" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-medium text-navy truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 break-all">{item.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copy(item.url)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center gap-2 text-sm">
                    <Copy className="w-4 h-4" /> 复制地址
                  </button>
                  <button onClick={() => remove(item.path)} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
