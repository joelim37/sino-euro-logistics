"use client";

import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Pilcrow, Image as ImageIcon } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const sanitizeImageUrl = (url: string) => url.trim();

export default function RichTextEditor({ label, value, onChange, hint }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

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

  const askImageStyle = () => {
    const raw = (window.prompt("图片样式：center / wide / left / right", "center") || "center").trim().toLowerCase();
    if (["center", "wide", "left", "right"].includes(raw)) return raw;
    return "center";
  };

  const addImageFromMedia = (item: { url: string; name: string }) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const alt = (window.prompt("请输入图片 alt 文本（可选）", item.name.replace(/\.[^/.]+$/, "")) || "").replace(/"/g, "&quot;");
    const style = askImageStyle();
    const html = buildImageHtml(item.url, alt, style);
    document.execCommand("insertHTML", false, html);
    syncValue();
    setShowMediaPicker(false);
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
        onClose={() => setShowMediaPicker(false)}
        onSelect={addImageFromMedia}
      />
    </>
  );
}
