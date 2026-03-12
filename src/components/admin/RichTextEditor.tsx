"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Pilcrow, Image as ImageIcon, Check, Pencil, Trash2 } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const sanitizeImageUrl = (url: string) => url.trim();

type ImageStyle = "center" | "wide" | "left" | "right";

const imageStyleOptions: { value: ImageStyle; label: string; previewClass: string; frameClass: string }[] = [
  { value: "center", label: "居中", previewClass: "w-24 mx-auto", frameClass: "items-center" },
  { value: "wide", label: "宽幅", previewClass: "w-full", frameClass: "items-center" },
  { value: "left", label: "左浮动", previewClass: "w-20 mr-auto", frameClass: "items-start" },
  { value: "right", label: "右浮动", previewClass: "w-20 ml-auto", frameClass: "items-end" },
];

const articleTemplate = `<h2>市场结论摘要</h2><p>先用 1-2 段把本次行业变化、主要影响和建议讲清楚。</p><h2>关键观察</h2><ul><li>观察 1：本周/本月运价、舱位、时效或政策变化</li><li>观察 2：重点国家/口岸/仓库动态</li><li>观察 3：对跨境卖家或外贸企业的直接影响</li></ul><h2>企业建议</h2><ol><li>建议 1：如何提前订舱或锁仓</li><li>建议 2：如何准备清关资料</li><li>建议 3：如何安排尾程与仓库预约</li></ol><h2>适用客户</h2><p>适合哪些货主、卖家或供应链场景。</p><h2>常见问题</h2><p><strong>Q：这类情况会影响哪些国家？</strong></p><p>A：写一个直接、明确、可摘取的回答。</p>`;

export default function RichTextEditor({ label, value, onChange, hint }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ url: string; name: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageStyle, setImageStyle] = useState<ImageStyle>("center");

  const syncValue = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const run = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    syncValue();
  };

  const addLink = () => {
    const url = window.prompt("请输入链接 URL");
    if (!url) return;
    run("createLink", url);
  };

  const addImageByUrl = () => {
    const url = window.prompt("请输入插图图片 URL");
    if (!url) return;
    const cleanUrl = sanitizeImageUrl(url);
    if (!cleanUrl) return;
    run("insertImage", cleanUrl);
  };

  const insertArticleTemplate = () => {
    if (!editorRef.current) return;
    const shouldReplace = !value.trim() || value === "<p></p>" || window.confirm("插入模板会在当前光标位置加入标准结构，是否继续？");
    if (!shouldReplace) return;
    editorRef.current.focus();
    document.execCommand("insertHTML", false, articleTemplate);
    syncValue();
  };

  const buildImageHtml = (url: string, alt: string, style: string) => {
    if (style === "wide") {
      return `<figure style="margin:24px 0;"><img src="${url}" alt="${alt}" style="width:100%;height:auto;border-radius:16px;display:block;" /><figcaption style="margin-top:8px;font-size:14px;color:#6b7280;text-align:center;">${alt}</figcaption></figure>`;
    }

    if (style === "left") {
      return `<img src="${url}" alt="${alt}" style="width:42%;max-width:320px;height:auto;border-radius:12px;float:left;margin:8px 20px 12px 0;" />`;
    }

    if (style === "right") {
      return `<img src="${url}" alt="${alt}" style="width:42%;max-width:320px;height:auto;border-radius:12px;float:right;margin:8px 0 12px 20px;" />`;
    }

    return `<img src="${url}" alt="${alt}" style="max-width:100%;height:auto;border-radius:12px;margin:16px auto;display:block;" />`;
  };

  const beginInsertImageFromMedia = (item: { url: string; name: string }) => {
    setPendingImage(item);
    setImageAlt(item.name.replace(/\.[^/.]+$/, ""));
    setImageStyle("center");
    setShowMediaPicker(false);
  };

  const getImageStyleFromElement = (img: HTMLImageElement): ImageStyle => {
    const style = img.getAttribute("style") || "";
    if (style.includes("width:100%")) return "wide";
    if (style.includes("float:left")) return "left";
    if (style.includes("float:right")) return "right";
    return "center";
  };

  const applyImageElementStyle = (img: HTMLImageElement, style: ImageStyle) => {
    if (style === "wide") {
      img.style.cssText = "width:100%;height:auto;border-radius:16px;display:block;";
      return;
    }
    if (style === "left") {
      img.style.cssText = "width:42%;max-width:320px;height:auto;border-radius:12px;float:left;margin:8px 20px 12px 0;";
      return;
    }
    if (style === "right") {
      img.style.cssText = "width:42%;max-width:320px;height:auto;border-radius:12px;float:right;margin:8px 0 12px 20px;";
      return;
    }
    img.style.cssText = "max-width:100%;height:auto;border-radius:12px;margin:16px auto;display:block;";
  };

  const confirmInsertImage = () => {
    if (!editorRef.current || !pendingImage) return;
    editorRef.current.focus();
    const alt = imageAlt.replace(/"/g, "&quot;");
    const html = buildImageHtml(pendingImage.url, alt, imageStyle);
    document.execCommand("insertHTML", false, html);
    syncValue();
    setPendingImage(null);
    setImageAlt("");
    setImageStyle("center");
  };

  const updateSelectedImage = () => {
    if (!selectedImage) return;
    selectedImage.alt = imageAlt;
    applyImageElementStyle(selectedImage, imageStyle);
    syncValue();
    setSelectedImage(null);
    setImageAlt("");
    setImageStyle("center");
  };

  const removeSelectedImage = () => {
    if (!selectedImage) return;
    const parent = selectedImage.parentElement;
    if (parent?.tagName === "FIGURE") {
      parent.remove();
    } else {
      selectedImage.remove();
    }
    syncValue();
    setSelectedImage(null);
    setImageAlt("");
    setImageStyle("center");
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!editor.contains(target)) return;
      setSelectedImage(target);
      setImageAlt(target.alt || "");
      setImageStyle(getImageStyleFromElement(target));
    };

    editor.addEventListener("click", handleClick);
    return () => editor.removeEventListener("click", handleClick);
  }, [value]);

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
          <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50">
            <button type="button" onClick={() => run("formatBlock", "<h1>")} className="px-3 py-2 rounded hover:bg-gray-200"><Heading1 className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("formatBlock", "<h2>")} className="px-3 py-2 rounded hover:bg-gray-200"><Heading2 className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("formatBlock", "<p>")} className="px-3 py-2 rounded hover:bg-gray-200"><Pilcrow className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("bold")} className="px-3 py-2 rounded hover:bg-gray-200"><Bold className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("italic")} className="px-3 py-2 rounded hover:bg-gray-200"><Italic className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("insertUnorderedList")} className="px-3 py-2 rounded hover:bg-gray-200"><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => run("insertOrderedList")} className="px-3 py-2 rounded hover:bg-gray-200"><ListOrdered className="w-4 h-4" /></button>
            <button type="button" onClick={addLink} className="px-3 py-2 rounded hover:bg-gray-200"><LinkIcon className="w-4 h-4" /></button>
            <button type="button" onClick={() => setShowMediaPicker(true)} className="px-3 py-2 rounded hover:bg-gray-200 inline-flex items-center gap-2" title="从媒体库插图">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">插图</span>
            </button>
            <button type="button" onClick={addImageByUrl} className="px-3 py-2 rounded hover:bg-gray-200 text-sm" title="手动输入图片地址">
              URL插图
            </button>
            <button type="button" onClick={insertArticleTemplate} className="px-3 py-2 rounded hover:bg-gray-200 text-sm" title="插入标准化行业文章模板">
              文章模板
            </button>
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="min-h-[320px] p-4 outline-none prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value || "<p></p>" }}
            onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
          />
        </div>
        {hint && <p className="text-sm text-gray-500 mt-2">{hint}</p>}
        <p className="text-xs text-gray-400 mt-2">小提示：点击正文中的图片，可二次修改样式、alt 文本或直接删除。</p>
      </div>

      <MediaPickerModal
        open={showMediaPicker}
        folder="news"
        title="选择正文插图"
        actionLabel="插入正文"
        helperText="点击按钮即可把图片一键插入到正文当前位置"
        onClose={() => setShowMediaPicker(false)}
        onSelect={beginInsertImageFromMedia}
      />

      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy">编辑正文图片</h3>
                <p className="text-sm text-gray-500 mt-1">可以修改图片说明、展示样式，或直接删除这张图</p>
              </div>
              <button type="button" onClick={() => setSelectedImage(null)} className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600">
                关闭
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">图片 Alt 文本</label>
                  <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} className="input-field" placeholder="例如：欧洲仓储配送现场" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">展示样式</label>
                  <div className="grid grid-cols-2 gap-3">
                    {imageStyleOptions.map((option) => {
                      const selected = imageStyle === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setImageStyle(option.value)}
                          className={`rounded-xl border p-3 text-left transition-all ${selected ? "border-navy ring-2 ring-navy/10 bg-navy/[0.03]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-800">{option.label}</span>
                            {selected && <Check className="w-4 h-4 text-navy" />}
                          </div>
                          <div className={`h-20 rounded-lg bg-gray-100 p-3 flex ${option.frameClass}`}>
                            <div className={`h-full rounded-md bg-gradient-to-br from-navy/80 to-gold/80 ${option.previewClass}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">当前图片</div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-[320px] flex items-center justify-center">
                  <Image src={selectedImage.src} alt={imageAlt || selectedImage.alt || "正文图片"} width={1200} height={800} className={`h-auto rounded-xl ${imageStyle === "wide" ? "w-full" : imageStyle === "center" ? "w-3/4 mx-auto" : imageStyle === "left" ? "w-1/2 mr-auto" : "w-1/2 ml-auto"}`} />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-between gap-3 bg-gray-50">
              <button type="button" onClick={removeSelectedImage} className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 inline-flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                删除图片
              </button>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setSelectedImage(null)} className="px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-600">
                  取消
                </button>
                <button type="button" onClick={updateSelectedImage} className="btn-primary inline-flex items-center gap-2">
                  <Pencil className="w-4 h-4" />
                  应用修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pendingImage && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy">插入正文图片</h3>
                <p className="text-sm text-gray-500 mt-1">先看效果，再一键插入到当前光标位置</p>
              </div>
              <button
                type="button"
                onClick={() => setPendingImage(null)}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-600"
              >
                关闭
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">图片 Alt 文本</label>
                  <input
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="input-field"
                    placeholder="例如：中欧物流运输现场"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">展示样式</label>
                  <div className="grid grid-cols-2 gap-3">
                    {imageStyleOptions.map((option) => {
                      const selected = imageStyle === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setImageStyle(option.value)}
                          className={`rounded-xl border p-3 text-left transition-all ${selected ? "border-navy ring-2 ring-navy/10 bg-navy/[0.03]" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-800">{option.label}</span>
                            {selected && <Check className="w-4 h-4 text-navy" />}
                          </div>
                          <div className={`h-20 rounded-lg bg-gray-100 p-3 flex ${option.frameClass}`}>
                            <div className={`h-full rounded-md bg-gradient-to-br from-navy/80 to-gold/80 ${option.previewClass}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">预览</div>
                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-[320px]">
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-400 mb-4">正文预览效果</p>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>这是一段示意文字，用来看正文图片插入后的版式效果。</p>
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white">
                        <Image src={pendingImage.url} alt={imageAlt || pendingImage.name} width={1200} height={800} className={`h-auto rounded-xl ${imageStyle === "wide" ? "w-full" : imageStyle === "center" ? "w-3/4 mx-auto" : imageStyle === "left" ? "w-1/2 mr-auto" : "w-1/2 ml-auto"}`} />
                      </div>
                      <p className={`text-xs text-gray-500 ${imageStyle === "left" ? "text-left" : imageStyle === "right" ? "text-right" : "text-center"}`}>
                        {imageAlt || "图片说明"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex items-center justify-end gap-3 bg-gray-50">
              <button type="button" onClick={() => setPendingImage(null)} className="px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-600">
                取消
              </button>
              <button type="button" onClick={confirmInsertImage} className="btn-primary inline-flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                插入正文
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
