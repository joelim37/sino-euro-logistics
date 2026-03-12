"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Loader2, Pencil, RefreshCw, Trash2, Upload } from "lucide-react";

interface MediaItem {
  name: string;
  path: string;
  url: string;
  folder: string;
}

const folderOptions = ["all", "banner", "services", "news", "news-og", "media-library"];

export default function MediaAdminPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [folder, setFolder] = useState("all");
  const [uploadFolder, setUploadFolder] = useState("media-library");
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");
  const [highlightedPath, setHighlightedPath] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/upload?folder=${encodeURIComponent(folder)}`);
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

    fetchMedia();
  }, [folder]);

  const upload = async (file?: File) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadFolder);
      if (newName.trim()) formData.append("name", newName.trim());
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "上传失败");
      setFolder(uploadFolder);
      setNewName("");
      setHighlightedPath(data.path || "");
      const refreshResponse = await fetch(`/api/admin/upload?folder=${encodeURIComponent(uploadFolder)}`);
      const refreshed = await refreshResponse.json();
      if (!refreshResponse.ok) throw new Error(refreshed.error || "加载失败");
      setItems(refreshed.items || []);
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

    setItems((prev) => prev.filter((item) => item.path !== path));
  };

  const rename = async (item: MediaItem) => {
    const base = item.name.replace(/\.[^/.]+$/, "");
    const updated = window.prompt("请输入新的图片名称", base);
    if (!updated || updated === base) return;
    const response = await fetch("/api/admin/upload", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPath: item.path, newName: updated }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "改名失败");
      return;
    }
    setHighlightedPath(data.path || "");
    setItems((prev) => prev.map((current) => current.path === item.path ? {
      ...current,
      name: data.name || current.name,
      path: data.path || current.path,
      url: data.url || current.url,
      folder: data.folder || current.folder,
    } : current));
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("图片地址已复制");
  };

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.name.toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword));
  }, [items, search]);

  const emptyText = useMemo(() => {
    if (search.trim()) return "没有搜到匹配的图片文件名。";
    if (folder === "all") return "媒体库暂时为空，先上传几张图片吧。";
    return `当前 ${folder} 分类下还没有图片。`;
  }, [folder, search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-navy font-bold">媒体库</h1>
          <p className="text-gray-500 mt-1">统一管理站点图片素材，可复制地址到 Banner、服务、新闻等模块使用</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} className="input-field min-w-[150px]">
            <option value="banner">banner</option>
            <option value="services">services</option>
            <option value="news">news</option>
            <option value="media-library">media-library</option>
          </select>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field min-w-[220px]" placeholder="可选：自定义图片名称" />
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2 justify-center">
            <Upload className="w-4 h-4" />
            {isUploading ? "上传中..." : "上传图片"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center gap-2 justify-center">
            <RefreshCw className="w-4 h-4" /> 刷新
          </button>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field"
          placeholder="按文件名搜索，例如：banner、logo、poland"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {folderOptions.map((item) => (
          <button
            key={item}
            onClick={() => setFolder(item)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${folder === item ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center"><Loader2 className="w-8 h-8 animate-spin text-gold mx-auto" /></div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-500">{emptyText}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredItems.map((item) => {
            const isHighlighted = highlightedPath === item.path;
            return (
              <div key={item.path} className={`group bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${isHighlighted ? "border-gold ring-2 ring-gold/30" : "border-gray-100"}`}>
                <div className="relative h-36 bg-gray-100 overflow-hidden">
                  <Image src={item.url} alt={item.name} fill className="object-cover transition-transform duration-300 group-hover:scale-125" />
                  <div className="absolute top-2 left-2 text-[11px] px-2 py-1 rounded-full bg-black/60 text-white">{item.folder}</div>
                </div>
                <div className="p-3 space-y-3">
                  <div>
                    <p className="font-medium text-navy truncate text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 break-all line-clamp-2">{item.path}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => copy(item.url)} className="px-2 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center" title="复制地址">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={() => rename(item)} className="px-2 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center" title="改名">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(item.path)} className="px-2 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center justify-center" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
