"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";

interface SiteSettings {
  company_name: string;
  company_name_en: string;
  company_phone: string;
  company_email: string;
  company_wechat: string;
  company_whatsapp: string;
  company_address: string;
  about_content: string;
  footer_content: string;
  home_news_count: string;
}

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    company_name: "",
    company_name_en: "",
    company_phone: "",
    company_email: "",
    company_wechat: "",
    company_whatsapp: "",
    company_address: "",
    about_content: "",
    footer_content: "",
    home_news_count: "3",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const keys = [
    "company_name",
    "company_name_en",
    "company_phone",
    "company_email",
    "company_wechat",
    "company_whatsapp",
    "company_address",
    "about_content",
    "footer_content",
    "home_news_count",
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/admin/config?keys=${keys.join(",")}`);
      const data = await response.json();
      if (data.config) {
        setSettings({
          company_name: data.config.company_name || "",
          company_name_en: data.config.company_name_en || "",
          company_phone: data.config.company_phone || "",
          company_email: data.config.company_email || "",
          company_wechat: data.config.company_wechat || "",
          company_whatsapp: data.config.company_whatsapp || "",
          company_address: data.config.company_address || "",
          about_content: data.config.about_content || "",
          footer_content: data.config.footer_content || "",
          home_news_count: data.config.home_news_count || "3",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
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
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
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
        <h1 className="text-2xl font-serif text-navy font-bold">网站设置</h1>
        <p className="text-gray-500 mt-1">管理全站通用信息</p>
      </div>

      <div className="space-y-8">
        {/* Company Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">公司信息</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称（中文）
                </label>
                <input
                  type="text"
                  value={settings.company_name}
                  onChange={(e) =>
                    setSettings({ ...settings, company_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="中欧通联国际物流有限公司"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公司名称（英文）
                </label>
                <input
                  type="text"
                  value={settings.company_name_en}
                  onChange={(e) =>
                    setSettings({ ...settings, company_name_en: e.target.value })
                  }
                  className="input-field"
                  placeholder="Sino Euro Logistics"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  value={settings.company_phone}
                  onChange={(e) =>
                    setSettings({ ...settings, company_phone: e.target.value })
                  }
                  className="input-field"
                  placeholder="+86 400-888-8888"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  电子邮箱
                </label>
                <input
                  type="email"
                  value={settings.company_email}
                  onChange={(e) =>
                    setSettings({ ...settings, company_email: e.target.value })
                  }
                  className="input-field"
                  placeholder="info@sinoeuro.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  微信
                </label>
                <input
                  type="text"
                  value={settings.company_wechat}
                  onChange={(e) =>
                    setSettings({ ...settings, company_wechat: e.target.value })
                  }
                  className="input-field"
                  placeholder="SinoEuroLogistics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.company_whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, company_whatsapp: e.target.value })
                  }
                  className="input-field"
                  placeholder="+86 138 0000 0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司地址
              </label>
              <input
                type="text"
                value={settings.company_address}
                onChange={(e) =>
                  setSettings({ ...settings, company_address: e.target.value })
                }
                className="input-field"
                placeholder="深圳市南山区粤海街道科技园南区"
              />
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">关于我们</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              公司简介
            </label>
            <textarea
              value={settings.about_content}
              onChange={(e) =>
                setSettings({ ...settings, about_content: e.target.value })
              }
              rows={6}
              className="input-field resize-none"
              placeholder="请输入公司简介内容..."
            />
          </div>
        </div>

        {/* Homepage News */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页新闻推荐</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              首页显示新闻数量
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={settings.home_news_count}
              onChange={(e) => setSettings({ ...settings, home_news_count: e.target.value })}
              className="input-field"
              placeholder="3"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">页脚设置</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              页脚描述
            </label>
            <textarea
              value={settings.footer_content}
              onChange={(e) =>
                setSettings({ ...settings, footer_content: e.target.value })
              }
              rows={3}
              className="input-field resize-none"
              placeholder="页脚显示的简短描述..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center">
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
            <span>{isSaving ? "保存中..." : "保存设置"}</span>
          </button>

          {saveSuccess && (
            <span className="ml-4 text-green-600 font-medium">
              保存成功！
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
