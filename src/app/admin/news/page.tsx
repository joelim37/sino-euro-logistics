"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Edit2, ExternalLink, Loader2, Plus, Search, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Toast from "@/components/admin/Toast";

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

const DRAFT_STORAGE_KEY = "news-admin-draft";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [form, setForm] = useState<NewsItem>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false,
    message: "",
    type: "success",
  });
  const previewWindowRef = useRef<Window | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedDraftRef = useRef(false);

  const canSave = useMemo(() => form.title.trim() && form.slug.trim(), [form.title, form.slug]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ open: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2600);
  };

  const filteredNews = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return news.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const keywordMatch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword);
      return statusMatch && keywordMatch;
    });
  }, [news, search, statusFilter]);

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/admin/news");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "加载失败");
      setNews(data.news || []);
      setError("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "加载失败";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as { form: NewsItem; slugTouched: boolean };
        if (parsed?.form && !parsed.form.id) {
          setForm(parsed.form);
          setSlugTouched(Boolean(parsed.slugTouched));
          showToast("已恢复上次未保存的草稿");
        }
      }
    } catch {
      // ignore draft restore errors
    } finally {
      hasLoadedDraftRef.current = true;
    }

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) return;
    if (form.id) return;

    const hasContent = Object.values(form).some((value) => typeof value === "string" && value.trim());

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      if (!hasContent) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return;
      }
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          form,
          slugTouched,
        })
      );
    }, 800);
  }, [form, slugTouched]);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setSlugTouched(false);
    previewWindowRef.current = null;
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  const getPreviewUrl = (item: NewsItem) => {
    if (item.id) {
      return item.status === "published" ? `/news/${item.slug}` : `/news/preview/${item.id}`;
    }
    return item.slug ? `/news/${item.slug}` : "";
  };

  const openPreview = (url: string) => {
    if (!url) return;
    if (previewWindowRef.current && !previewWindowRef.current.closed) {
      previewWindowRef.current.location.href = url;
      previewWindowRef.current.focus();
      return;
    }
    previewWindowRef.current = window.open(url, "news-preview-window");
  };

  const handlePreview = () => {
    const previewUrl = getPreviewUrl(form);
    if (!previewUrl) {
      const message = "请先填写 slug 后再预览";
      setError(message);
      showToast(message, "error");
      return;
    }
    openPreview(previewUrl);
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugTouched ? prev.slug : slugify(title),
    }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugTouched(true);
    setForm((prev) => ({ ...prev, slug: slugify(slug) }));
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
      const nextUrl = form.status === "published" ? data.publishedUrl : data.previewUrl;
      if (nextUrl) openPreview(nextUrl);
      setForm((prev) => ({
        ...prev,
        id: data.id || prev.id,
        slug: data.slug || prev.slug,
      }));
      setIsEditing(true);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      showToast(form.status === "published" ? "新闻已保存并打开正式文章页" : "草稿已保存并打开预览页");
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存失败";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id?: string, title?: string) => {
    if (!id || !confirm(`确定要删除这篇新闻吗？\n\n${title || ""}`)) return;
    const response = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      const message = data.error || "删除失败";
      setError(message);
      showToast(message, "error");
      return;
    }
    await fetchNews();
    if (form.id === id) resetForm();
    showToast("新闻已删除");
  };

  return (
    <>
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
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-serif text-navy font-bold">已有新闻</h2>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
                placeholder="搜索标题 / slug / 摘要"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "全部" },
                { key: "draft", label: "草稿" },
                { key: "published", label: "已发布" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setStatusFilter(item.key as "all" | "draft" | "published")}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${statusFilter === item.key ? "bg-navy text-white border-navy" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" /></div>
            ) : filteredNews.length === 0 ? (
              <div className="text-gray-500 text-sm">{search.trim() || statusFilter !== "all" ? "没有匹配的新闻。" : "还没有新闻，先创建第一篇。"}</div>
            ) : (
              <div className="space-y-3">
                {filteredNews.map((item) => (
                  <div key={item.id} className="border rounded-xl p-4 hover:border-gold transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-navy truncate">{item.title}</h3>
                        <p className="text-sm text-gray-500 truncate">/{item.slug}</p>
                        <p className="text-xs mt-2 inline-flex px-2 py-1 rounded bg-gray-100 text-gray-600">{item.status === "published" ? "已发布" : "草稿"}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => openPreview(getPreviewUrl(item))} className="p-2 rounded-lg hover:bg-gray-100" title="预览文章"><ExternalLink className="w-4 h-4 text-navy" /></button>
                        <button onClick={() => { setForm({ ...emptyForm, ...item }); setIsEditing(true); setSlugTouched(true); }} className="p-2 rounded-lg hover:bg-gray-100" title="编辑"><Edit2 className="w-4 h-4 text-navy" /></button>
                        <button onClick={() => handleDelete(item.id, item.title)} className="p-2 rounded-lg hover:bg-red-50" title="删除"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-serif text-navy font-bold">{isEditing ? "编辑新闻" : "新建新闻"}</h2>
              {!form.id && (
                <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  正在自动保存本地草稿
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
                <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} className="input-field" placeholder="请输入新闻标题" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} className="input-field" placeholder="news-title" />
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
              hint="支持标题、段落、加粗、列表、链接，也支持从媒体库直接插图"
            />

            <ImageUploadField
              label="封面图片"
              value={form.featured_image}
              onChange={(value) => setForm({ ...form, featured_image: value })}
              folder="news"
              hint="支持媒体库选择或上传本地图片"
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
                hint="支持媒体库选择；为空则默认使用封面图"
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

            <div className="flex justify-end gap-3 pt-2 flex-wrap">
              <button onClick={handlePreview} disabled={!form.slug.trim()} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 inline-flex items-center gap-2 disabled:opacity-60">
                <ExternalLink className="w-4 h-4" />
                预览文章
              </button>
              <button onClick={resetForm} className="px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-600">取消</button>
              <button onClick={handleSave} disabled={!canSave || isSaving} className="btn-primary disabled:opacity-60 inline-flex items-center gap-2">
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                保存新闻
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </>
  );
}
