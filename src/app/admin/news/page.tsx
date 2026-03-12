"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Copy, Edit2, ExternalLink, Loader2, Plus, Search, Star, Trash2 } from "lucide-react";
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
  featured_image_position?: string;
  og_image: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  status: "draft" | "published";
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  is_top?: boolean;
}

const emptyForm: NewsItem = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  featured_image: "",
  featured_image_alt: "",
  featured_image_position: "center center",
  og_image: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  status: "draft",
  published_at: null,
};

const DRAFT_STORAGE_KEY = "news-admin-draft";
const ITEMS_PER_PAGE = 6;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const suggestAltFromName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [sortBy, setSortBy] = useState<"updated_desc" | "updated_asc" | "title_asc" | "title_desc">("updated_desc");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<NewsItem>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: "success" | "error" }>({
    open: false,
    message: "",
    type: "success",
  });
  const [autosaveState, setAutosaveState] = useState<"idle" | "typing" | "local-saved" | "saving" | "saved" | "error">("idle");
  const [linkOgToFeatured, setLinkOgToFeatured] = useState(true);
  const [isSavingTop, setIsSavingTop] = useState(false);
  const [draggingTopId, setDraggingTopId] = useState<string | null>(null);
  const previewWindowRef = useRef<Window | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dbAutosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedDraftRef = useRef(false);

  const canSave = useMemo(() => form.title.trim() && form.slug.trim(), [form.title, form.slug]);

  const autosaveLabelMap: Record<typeof autosaveState, string> = {
    idle: "自动保存待命",
    typing: "检测到修改…",
    "local-saved": "本地草稿已保存",
    saving: "正在同步数据库草稿…",
    saved: "数据库草稿已保存",
    error: "自动保存失败",
  };

  const seoTitleLength = form.seo_title.trim().length;
  const seoDescriptionLength = form.seo_description.trim().length;

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ open: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2600);
  }, []);

  const filteredNews = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    let result = news.filter((item) => {
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const keywordMatch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.slug.toLowerCase().includes(keyword) ||
        item.summary.toLowerCase().includes(keyword);
      return statusMatch && keywordMatch;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === "title_asc") return a.title.localeCompare(b.title);
      if (sortBy === "title_desc") return b.title.localeCompare(a.title);

      const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
      const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
      if (sortBy === "updated_asc") return aTime - bTime;
      return bTime - aTime;
    });

    return result;
  }, [news, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / ITEMS_PER_PAGE));
  const pagedNews = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const fetchNews = useCallback(async () => {
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
  }, [showToast]);

  useEffect(() => {
    fetchNews();

    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as { form: NewsItem; slugTouched: boolean };
        if (parsed?.form && (!parsed.form.id || parsed.form.status === "draft")) {
          setForm(parsed.form);
          setSlugTouched(Boolean(parsed.slugTouched));
          setIsEditing(Boolean(parsed.form.id));
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
      if (dbAutosaveTimerRef.current) clearTimeout(dbAutosaveTimerRef.current);
    };
  }, [fetchNews, showToast]);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) return;

    const hasContent = Object.values(form).some((value) => typeof value === "string" && value.trim());

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setAutosaveState(hasContent ? "typing" : "idle");

    autosaveTimerRef.current = setTimeout(() => {
      if (!hasContent) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setAutosaveState("idle");
        return;
      }
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          form,
          slugTouched,
        })
      );
      setAutosaveState("local-saved");
    }, 800);
  }, [form, slugTouched]);

  const autosavePayload = useMemo(() => ({
    ...form,
    status: form.id ? form.status : "draft",
    published_at: form.id ? form.published_at : null,
  }), [form]);

  useEffect(() => {
    if (!hasLoadedDraftRef.current) return;
    if (!autosavePayload.title.trim() || !autosavePayload.slug.trim()) return;
    if (isSaving) return;

    if (dbAutosaveTimerRef.current) clearTimeout(dbAutosaveTimerRef.current);
    setAutosaveState("saving");

    dbAutosaveTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(autosavePayload),
        });

        const data = await response.json();
        if (!response.ok) {
          setAutosaveState("error");
          return;
        }

        setForm((prev) => ({
          ...prev,
          id: data.id || prev.id,
          slug: data.slug || prev.slug,
        }));
        setIsEditing(true);
        setAutosaveState("saved");
      } catch {
        setAutosaveState("error");
      }
    }, 2500);
  }, [autosavePayload, isSaving]);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setSlugTouched(false);
    setAutosaveState("idle");
    setLinkOgToFeatured(true);
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

  useEffect(() => {
    if (!linkOgToFeatured) return;
    setForm((prev) => {
      if (prev.og_image === prev.featured_image) return prev;
      return {
        ...prev,
        og_image: prev.featured_image,
      };
    });
  }, [form.featured_image, linkOgToFeatured]);

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);
    setAutosaveState("saving");
    setError("");
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存失败");

      if ((form.featured_image_position || "center center") && (data.slug || form.slug)) {
        await fetch("/api/admin/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [`news_cover_focus:${data.slug || form.slug}`]: form.featured_image_position || "center center" }),
        });
      }

      await fetchNews();
      const nextUrl = form.status === "published" ? data.publishedUrl : data.previewUrl;
      if (nextUrl) openPreview(nextUrl);
      setForm((prev) => ({
        ...prev,
        id: data.id || prev.id,
        slug: data.slug || prev.slug,
      }));
      setIsEditing(true);
      setAutosaveState("saved");
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      showToast(form.status === "published" ? "新闻已保存并打开正式文章页" : "草稿已保存并打开预览页");
    } catch (err) {
      const message = err instanceof Error ? err.message : "保存失败";
      setError(message);
      setAutosaveState("error");
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

  const getPublishedUrl = (slug?: string) => {
    if (!slug) return "";
    if (typeof window === "undefined") return `/news/${slug}`;
    return `${window.location.origin}/news/${slug}`;
  };

  const handleCopyPublishedUrl = async (slug?: string) => {
    const url = getPublishedUrl(slug);
    if (!url) {
      showToast("请先保存文章并生成 slug", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast("正式文章链接已复制");
    } catch {
      showToast("复制失败，请手动复制链接", "error");
    }
  };

  const saveTopIds = useCallback(async (nextTopIds: string[], successMessage: string) => {
    setIsSavingTop(true);
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home_news_top_ids: nextTopIds.join(",") }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "置顶保存失败");

      await fetchNews();
      showToast(successMessage);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "置顶保存失败", "error");
    } finally {
      setIsSavingTop(false);
    }
  }, [fetchNews, showToast]);

  const handleToggleTop = async (item: NewsItem) => {
    if (!item.id) return;
    const currentTopIds = news.filter((entry) => entry.is_top && entry.id).map((entry) => entry.id as string);
    const nextTopIds = item.is_top ? currentTopIds.filter((id) => id !== item.id) : [item.id, ...currentTopIds.filter((id) => id !== item.id)].slice(0, 3);
    await saveTopIds(nextTopIds, item.is_top ? "已取消置顶" : "已设为首页推荐置顶");
  };

  const topStories = useMemo(() => news.filter((item) => item.is_top && item.id), [news]);

  const handleTopDrop = async (targetId: string) => {
    if (!draggingTopId || draggingTopId === targetId) return;
    const ordered = [...topStories];
    const fromIndex = ordered.findIndex((item) => item.id === draggingTopId);
    const toIndex = ordered.findIndex((item) => item.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = ordered.splice(fromIndex, 1);
    ordered.splice(toIndex, 0, moved);
    setDraggingTopId(null);
    await saveTopIds(ordered.map((item) => item.id as string), "首页推荐顺序已更新");
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
          <div className="xl:col-span-2 space-y-6 h-fit">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-serif text-navy font-bold">首页推荐规则</h2>
                {isSavingTop && <span className="text-xs text-gray-400">保存中...</span>}
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">已置顶的文章会优先出现在首页推荐区。拖拽可调整推荐顺序。</p>
                {topStories.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">还没有置顶文章。先在下方列表里给已发布新闻点亮星标。</div>
                ) : (
                  <div className="space-y-2">
                    {topStories.map((item, index) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggingTopId(item.id || null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => item.id && handleTopDrop(item.id)}
                        className={`rounded-xl border px-4 py-3 bg-white cursor-move transition-all ${draggingTopId === item.id ? "border-navy opacity-70" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs flex items-center justify-center shrink-0">{index + 1}</span>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-navy truncate">{item.title}</div>
                            <div className="text-xs text-gray-500 truncate">/{item.slug}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
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

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="input-field">
              <option value="updated_desc">按更新时间：最新</option>
              <option value="updated_asc">按更新时间：最早</option>
              <option value="title_asc">按标题：A-Z</option>
              <option value="title_desc">按标题：Z-A</option>
            </select>

            {isLoading ? (
              <div className="py-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" /></div>
            ) : pagedNews.length === 0 ? (
              <div className="text-gray-500 text-sm">{search.trim() || statusFilter !== "all" ? "没有匹配的新闻。" : "还没有新闻，先创建第一篇。"}</div>
            ) : (
              <>
                <div className="space-y-3">
                  {pagedNews.map((item) => (
                    <div key={item.id} className="border rounded-xl p-4 hover:border-gold transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-navy truncate">{item.title}</h3>
                            {item.is_top && <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><Star className="w-3 h-3 fill-current" />置顶</span>}
                          </div>
                          <p className="text-sm text-gray-500 truncate">/{item.slug}</p>
                          <p className={`text-xs mt-2 inline-flex px-2 py-1 rounded ${item.status === "published" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>{item.status === "published" ? "已发布" : "草稿"}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === "published" && (
                            <button
                              onClick={() => handleToggleTop(item)}
                              disabled={isSavingTop}
                              className={`p-2 rounded-lg ${item.is_top ? "bg-amber-50 hover:bg-amber-100" : "hover:bg-gray-100"} disabled:opacity-60`}
                              title={item.is_top ? "取消置顶" : "设为首页置顶"}
                            ><Star className={`w-4 h-4 ${item.is_top ? "text-amber-600 fill-current" : "text-navy"}`} /></button>
                          )}
                          {item.status === "published" && (
                            <button onClick={() => handleCopyPublishedUrl(item.slug)} className="p-2 rounded-lg hover:bg-gray-100" title="复制正式链接"><Copy className="w-4 h-4 text-navy" /></button>
                          )}
                          <button onClick={() => openPreview(getPreviewUrl(item))} className="p-2 rounded-lg hover:bg-gray-100" title="预览文章"><ExternalLink className="w-4 h-4 text-navy" /></button>
                          <button onClick={() => { setForm({ ...emptyForm, ...item }); setIsEditing(true); setSlugTouched(true); setLinkOgToFeatured(!item.og_image || item.og_image === item.featured_image); }} className="p-2 rounded-lg hover:bg-gray-100" title="编辑"><Edit2 className="w-4 h-4 text-navy" /></button>
                          <button onClick={() => handleDelete(item.id, item.title)} className="p-2 rounded-lg hover:bg-red-50" title="删除"><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 text-sm text-gray-500">
                  <span>第 {page} / {totalPages} 页</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>

          <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="text-xl font-serif text-navy font-bold">{isEditing ? "编辑新闻" : "新建新闻"}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-xs rounded-full px-3 py-1 border inline-flex items-center gap-2 ${autosaveState === "error" ? "text-red-600 bg-red-50 border-red-200" : autosaveState === "saved" ? "text-green-700 bg-green-50 border-green-200" : "text-gray-500 bg-gray-50 border-gray-200"}`}
                >
                  {autosaveState === "saving" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {autosaveState === "saved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {autosaveLabelMap[autosaveState]}
                </span>
                {form.featured_image_alt && (
                  <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 truncate max-w-[260px]">
                    Alt 建议：{form.featured_image_alt}
                  </span>
                )}
              </div>
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
              hint="插图支持可视化选择：居中 / 宽幅 / 左浮动 / 右浮动"
            />

            <ImageUploadField
              label="封面图片"
              value={form.featured_image}
              onChange={(value) => setForm({ ...form, featured_image: value })}
              onSelectMedia={(item) => {
                const suggestedAlt = suggestAltFromName(item.name);
                setForm((prev) => ({
                  ...prev,
                  featured_image: item.url,
                  featured_image_alt: prev.featured_image_alt.trim() ? prev.featured_image_alt : suggestedAlt,
                }));
              }}
              folder="news"
              hint="支持媒体库选择或上传本地图片；下方可调整封面显示焦点"
              focusPosition={form.featured_image_position || "center center"}
              onFocusPositionChange={(value) => setForm({ ...form, featured_image_position: value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">封面图片 Alt</label>
                <input value={form.featured_image_alt} onChange={(e) => setForm({ ...form, featured_image_alt: e.target.value })} className="input-field" placeholder="例如：中欧班列货运现场照片" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkOgToFeatured}
                    onChange={(e) => setLinkOgToFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">OG 图跟随封面图</div>
                    <div className="text-xs text-gray-500">开启后，封面图变化时会自动同步到分享图</div>
                  </div>
                </label>
                <ImageUploadField
                  label="OG 分享图（可选）"
                  value={form.og_image}
                  onChange={(value) => {
                    setLinkOgToFeatured(false);
                    setForm({ ...form, og_image: value });
                  }}
                  onSelectMedia={() => setLinkOgToFeatured(false)}
                  folder="news-og"
                  hint={linkOgToFeatured ? "当前已与封面图联动；手动修改后会自动关闭联动" : "支持媒体库选择；为空则默认使用封面图"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">发布状态</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: "draft" })}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${form.status === "draft" ? "border-gray-400 bg-gray-50 ring-2 ring-gray-200" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                  >
                    <div className="text-sm font-medium text-gray-800">草稿</div>
                    <div className="text-xs text-gray-500 mt-1">仅后台可见，适合继续编辑</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, status: "published", published_at: form.published_at || new Date().toISOString() })}
                    className={`rounded-xl border px-4 py-3 text-left transition-all ${form.status === "published" ? "border-green-400 bg-green-50 ring-2 ring-green-100" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                  >
                    <div className="text-sm font-medium text-gray-800">已发布</div>
                    <div className="text-xs text-gray-500 mt-1">前台可见，会进入新闻列表/首页推荐</div>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">发布时间（可选）</label>
                <input type="datetime-local" value={form.published_at ? form.published_at.slice(0, 16) : ""} onChange={(e) => setForm({ ...form, published_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className="input-field" />
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold text-navy">SEO 设置</h3>
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label className="block text-sm font-medium text-gray-700">SEO 标题</label>
                  <span className={`text-xs ${seoTitleLength > 60 ? "text-amber-600" : "text-gray-400"}`}>{seoTitleLength}/60</span>
                </div>
                <input value={form.seo_title} onChange={(e) => setForm({ ...form, seo_title: e.target.value })} className="input-field" placeholder="为空则默认使用新闻标题" />
                <p className="text-xs text-gray-500 mt-2">建议控制在 30-60 字，过长可能在搜索结果中被截断。</p>
              </div>
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label className="block text-sm font-medium text-gray-700">SEO 描述</label>
                  <span className={`text-xs ${seoDescriptionLength > 160 ? "text-amber-600" : seoDescriptionLength < 60 && seoDescriptionLength > 0 ? "text-amber-500" : "text-gray-400"}`}>{seoDescriptionLength}/160</span>
                </div>
                <textarea value={form.seo_description} onChange={(e) => setForm({ ...form, seo_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="建议 60-160 字" />
                <p className="text-xs text-gray-500 mt-2">建议控制在 60-160 字，太短信息不足，太长也容易被截断。</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SEO 关键词</label>
                <input value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} className="input-field" placeholder="例如：中欧物流, 波兰清关, 欧洲卡航" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 flex-wrap">
              {form.status === "published" && form.slug.trim() && (
                <button onClick={() => handleCopyPublishedUrl(form.slug)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 inline-flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  复制正式链接
                </button>
              )}
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
