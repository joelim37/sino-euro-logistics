"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface NewsItem {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  og_image: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: "draft" | "published";
  published_at?: string | null;
}

const emptyForm: NewsItem = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  featured_image: "",
  featured_image_alt: "",
  og_image: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  status: "draft",
  published_at: null,
};

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<NewsItem>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const canSave = useMemo(() => form.title.trim() && form.slug.trim(), [form.title, form.slug]);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "加载失败");
      setNews(data.news || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setError("");
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存失败");
      await fetchNews();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("确定要删除这篇新闻吗？")) return;
    const response = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "删除失败");
      return;
    }
    await fetchNews();
    if (form.id === id) resetForm();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-navy font-bold">新闻管理</h1>
          <p className="text-gray-500 mt-1">新增、编辑新闻，并设置 SEO 信息</p>
        </div>
        <button onClick={resetForm} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新建新闻
        </button>
      </div>

      {error && <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm p-6 space-y-4 h-fit">
          <h2 className="text-xl font-serif text-navy font-bold">已有新闻</h2>

          {isLoading ? (
            <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" /></div>
          ) : news.length === 0 ? (
            <div className="text-gray-500 text-sm">还没有新闻，先创建第一篇。</div>
          ) : (
            <div className="space-y-3">
              {news.map((item) => (
                <div key={item.id} className="border rounded-xl p-4 hover:border-gold transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-navy truncate">{item.title}</h3>
                      <p className="text-sm text-gray-500 truncate">/{item.slug}</p>
                      <p className="text-xs mt-2 inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600">{item.status === "published" ? "已发布" : "草稿"}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => { setForm({ ...emptyForm, ...item }); setIsEditing(true); }} className="p-2 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-navy" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-xl font-serif text-navy font-bold">{isEditing ? "编辑新闻" : "新建新闻"}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="请输入新闻标题" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="input-field" placeholder="news-title" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">摘要</label>
            <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={3} className="input-field resize-none" placeholder="用于列表页和 SEO 描述的简要摘要" />
          </div>

          <RichTextEditor
            label="正文"
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            hint="支持标题、段落、加粗、列表、链接等基础富文本"
          />

          <ImageUploadField
            label="封面图片"
            value={form.featured_image}
            onChange={(value) => setForm({ ...form, featured_image: value })}
            folder="news"
            hint="支持直接上传电脑本地图片到 Supabase Storage"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">封面图片 Alt</label>
              <input value={form.featured_image_alt} onChange={(e) => setForm({ ...form, featured_image_alt: e.target.value })} className="input-field" placeholder="例如：中欧班列货运现场照片" />
            </div>
            <ImageUploadField
              label="OG 分享图（可选）"
              value={form.og_image}
              onChange={(value) => setForm({ ...form, og_image: value })}
              folder="news-og"
              hint="为空则默认使用封面图"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">发布状态</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })} className="input-field">
                <option value="draft">草稿</option>
                <option value="published">已发布</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">发布时间（可选）</label>
              <input type="datetime-local" value={form.published_at ? form.published_at.slice(0, 16) : ""} onChange={(e) => setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="input-field" />
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold text-navy">SEO 设置</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO 标题</label>
              <input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} className="input-field" placeholder="为空则默认使用新闻标题" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO 描述</label>
              <textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="建议 60-160 字" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO 关键词</label>
              <input value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} className="input-field" placeholder="例如：中欧物流, 波兰清关, 欧洲卡航" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={resetForm} className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">取消</button>
            <button onClick={handleSave} disabled={!canSave || isSaving} className="btn-primary disabled:opacity-60 inline-flex items-center gap-2">
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              保存新闻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
