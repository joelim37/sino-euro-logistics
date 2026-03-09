"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, Upload, Loader2 } from "lucide-react";

interface BannerConfig {
  banner_title: string;
  banner_subtitle: string;
  banner_image: string;
  banner_button_text: string;
  banner_button_link: string;
}

export default function BannerAdminPage() {
  const [config, setConfig] = useState<BannerConfig>({
    banner_title: "",
    banner_subtitle: "",
    banner_image: "",
    banner_button_text: "",
    banner_button_link: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch("/api/admin/config?keys=banner_title,banner_subtitle,banner_image,banner_button_text,banner_button_link");
      const data = await response.json();
      if (data.config) {
        setConfig(data.config);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving config:", error);
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
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-navy font-bold">Banner 管理</h1>
        <p className="text-gray-500 mt-1">修改首页 Hero 区域的展示内容</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        {/* Preview */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-navy mb-4">预览效果</h2>
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
            <Image
              src={config.banner_image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920"}
              alt="Banner Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-navy/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h3 className="text-2xl md:text-4xl font-serif text-white font-bold mb-4">
                {config.banner_title || "标题预览"}
              </h3>
              <p className="text-gray-200 mb-6">
                {config.banner_subtitle || "副标题预览"}
              </p>
              {config.banner_button_text && (
                <span className="bg-gold text-white px-6 py-2 rounded-lg">
                  {config.banner_button_text}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner 图片 URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={config.banner_image}
                onChange={(e) =>
                  setConfig({ ...config, banner_image: e.target.value })
                }
                className="input-field flex-1"
                placeholder="请输入图片URL"
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              建议尺寸：1920x1080，推荐使用高清物流相关图片
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主标题
            </label>
            <input
              type="text"
              value={config.banner_title}
              onChange={(e) =>
                setConfig({ ...config, banner_title: e.target.value })
              }
              className="input-field"
              placeholder="例如：专注中欧走廊的物流专家"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              副标题
            </label>
            <input
              type="text"
              value={config.banner_subtitle}
              onChange={(e) =>
                setConfig({ ...config, banner_subtitle: e.target.value })
              }
              className="input-field"
              placeholder="例如：14天最快到欧，欧盟清关全托管"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                按钮文字
              </label>
              <input
                type="text"
                value={config.banner_button_text}
                onChange={(e) =>
                  setConfig({ ...config, banner_button_text: e.target.value })
                }
                className="input-field"
                placeholder="例如：立即咨询"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                按钮链接
              </label>
              <input
                type="text"
                value={config.banner_button_link}
                onChange={(e) =>
                  setConfig({ ...config, banner_button_link: e.target.value })
                }
                className="input-field"
                placeholder="/contact"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isSaving ? "保存中..." : "保存修改"}</span>
            </button>

            {saveSuccess && (
              <span className="ml-4 text-green-600 font-medium">
                保存成功！
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
