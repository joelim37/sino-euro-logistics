"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Pilcrow, Image as ImageIcon, Check } from "lucide-react";
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

export default function RichTextEditor({ label, value, onChange, hint }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pendingImage, setPendingImage] = useState<{ url: string; name: string } | null>(null);
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
