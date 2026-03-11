"use client";

import { useRef } from "react";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Pilcrow } from "lucide-react";

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export default function RichTextEditor({ label, value, onChange, hint }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  const run = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt("请输入链接 URL");
    if (!url) return;
    run("createLink", url);
  };

  return (
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
  );
}
