"use client";

import { useEffect, useState } from "react";
import { GripVertical, Loader2, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface PartnerItem {
  id: string;
  name: string;
  logo: string;
  website: string;
  linkEnabled: boolean;
}

const PARTNER_KEYS = ["partners_section_title", "partners_section_subtitle", "partners_items"] as const;

function createPartner(): PartnerItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    logo: "",
    website: "",
    linkEnabled: false,
  };
}

export default function PartnersAdminPage() {
  const [sectionTitle, setSectionTitle] = useState("合作伙伴");
  const [sectionSubtitle, setSectionSubtitle] = useState("与稳定可靠的合作伙伴协同，为客户提供更完整的中欧物流服务能力。");
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/admin/config?keys=${PARTNER_KEYS.join(",")}`);
        const data = await response.json();
        const config = data.config || {};
        setSectionTitle(config.partners_section_title || "合作伙伴");
        setSectionSubtitle(
          config.partners_section_subtitle || "与稳定可靠的合作伙伴协同，为客户提供更完整的中欧物流服务能力。"
        );

        if (config.partners_items) {
          try {
            const parsed = JSON.parse(config.partners_items);
            setPartners(Array.isArray(parsed) ? parsed : []);
          } catch {
            setPartners([]);
          }
        }
      } catch (error) {
        console.error("Error fetching partners config:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const updatePartner = (id: string, updates: Partial<PartnerItem>) => {
    setPartners((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const addPartner = () => setPartners((prev) => [...prev, createPartner()]);
  const removePartner = (id: string) => setPartners((prev) => prev.filter((item) => item.id !== id));

  const handleDragStart = (id: string) => setDraggingId(id);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    setPartners((prev) => {
      const next = [...prev];
      const fromIndex = next.findIndex((item) => item.id === draggingId);
      const toIndex = next.findIndex((item) => item.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    setDraggingId(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        partners_section_title: sectionTitle,
        partners_section_subtitle: sectionSubtitle,
        partners_items: JSON.stringify(partners),
      };
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("保存失败");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving partners config:", error);
      alert("保存失败，请稍后重试");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-navy font-bold">合作伙伴管理</h1>
          <p className="text-gray-500 mt-1">用于 About 页展示合作伙伴 Logo，可控制是否跳转官网，并支持拖拽排序。</p>
        </div>
        <button onClick={addPartner} className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增伙伴
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-navy">区块文案</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">区块标题</label>
          <input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} className="input-field" placeholder="合作伙伴" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">区块副标题</label>
          <textarea value={sectionSubtitle} onChange={(e) => setSectionSubtitle(e.target.value)} rows={3} className="input-field resize-none" placeholder="请输入区块说明" />
        </div>
      </div>

      <div className="space-y-4">
        {partners.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">还没有合作伙伴，点击右上角“新增伙伴”开始添加。</div>
        ) : (
          partners.map((partner, index) => (
            <div
              key={partner.id}
              draggable
              onDragStart={() => handleDragStart(partner.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(partner.id)}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-3 text-gray-500">
                  <GripVertical className="w-5 h-5 cursor-grab" />
                  <span className="text-sm">伙伴 #{index + 1}（拖拽可排序）</span>
                </div>
                <button onClick={() => removePartner(partner.id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" /> 删除
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                    <input
                      value={partner.name}
                      onChange={(e) => updatePartner(partner.id, { name: e.target.value })}
                      className="input-field"
                      placeholder="例如：DHL / DB Cargo / 某欧洲仓配伙伴"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">官网链接（可选）</label>
                    <input
                      type="url"
                      value={partner.website}
                      onChange={(e) => updatePartner(partner.id, { website: e.target.value })}
                      className="input-field"
                      placeholder="https://example.com"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={partner.linkEnabled}
                      onChange={(e) => updatePartner(partner.id, { linkEnabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    点击 Logo 跳转到合作伙伴官网
                  </label>
                </div>

                <ImageUploadField
                  label="伙伴 Logo"
                  value={partner.logo}
                  onChange={(value) => updatePartner(partner.id, { logo: value })}
                  folder="media-library"
                  hint="建议上传透明背景 Logo 或横版品牌图"
                />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={isSaving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "保存中..." : "保存合作伙伴设置"}
        </button>
        {saveSuccess && <span className="text-green-600 font-medium">保存成功！</span>}
      </div>
    </div>
  );
}
