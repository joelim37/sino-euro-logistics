"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface SiteSettings {
  company_name: string;
  company_name_en: string;
  company_phone: string;
  company_email: string;
  company_wechat: string;
  company_whatsapp: string;
  company_address: string;
  about_content: string;
  about_image: string;
  footer_content: string;
  home_news_count: string;
  home_news_rule: string;
  advantages_section_title: string;
  advantages_section_subtitle: string;
  advantage_1_title: string;
  advantage_1_description: string;
  advantage_2_title: string;
  advantage_2_description: string;
  advantage_3_title: string;
  advantage_3_description: string;
  advantage_4_title: string;
  advantage_4_description: string;
  values_section_title: string;
  value_1_title: string;
  value_1_description: string;
  value_2_title: string;
  value_2_description: string;
  value_3_title: string;
  value_3_description: string;
  capabilities_section_title: string;
  capabilities_section_subtitle: string;
  capability_1_title: string;
  capability_1_description: string;
  capability_2_title: string;
  capability_2_description: string;
  capability_3_title: string;
  capability_3_description: string;
  capability_4_title: string;
  capability_4_description: string;
  audience_section_title: string;
  audience_section_subtitle: string;
  audience_1_title: string;
  audience_1_description: string;
  audience_2_title: string;
  audience_2_description: string;
  audience_3_title: string;
  audience_3_description: string;
  home_faq_1_question: string;
  home_faq_1_answer: string;
  home_faq_2_question: string;
  home_faq_2_answer: string;
  home_faq_3_question: string;
  home_faq_3_answer: string;
  home_faq_4_question: string;
  home_faq_4_answer: string;
  home_cta_title: string;
  home_cta_description: string;
  home_cta_button_text: string;
  home_cta_link: string;
  inquiry_transport_options: string;
}

const SETTINGS_KEYS = [
  "company_name",
  "company_name_en",
  "company_phone",
  "company_email",
  "company_wechat",
  "company_whatsapp",
  "company_address",
  "about_content",
  "about_image",
  "footer_content",
  "home_news_count",
  "home_news_rule",
  "advantages_section_title",
  "advantages_section_subtitle",
  "advantage_1_title",
  "advantage_1_description",
  "advantage_2_title",
  "advantage_2_description",
  "advantage_3_title",
  "advantage_3_description",
  "advantage_4_title",
  "advantage_4_description",
  "values_section_title",
  "value_1_title",
  "value_1_description",
  "value_2_title",
  "value_2_description",
  "value_3_title",
  "value_3_description",
  "capabilities_section_title",
  "capabilities_section_subtitle",
  "capability_1_title",
  "capability_1_description",
  "capability_2_title",
  "capability_2_description",
  "capability_3_title",
  "capability_3_description",
  "capability_4_title",
  "capability_4_description",
  "audience_section_title",
  "audience_section_subtitle",
  "audience_1_title",
  "audience_1_description",
  "audience_2_title",
  "audience_2_description",
  "audience_3_title",
  "audience_3_description",
  "home_faq_1_question",
  "home_faq_1_answer",
  "home_faq_2_question",
  "home_faq_2_answer",
  "home_faq_3_question",
  "home_faq_3_answer",
  "home_faq_4_question",
  "home_faq_4_answer",
  "home_cta_title",
  "home_cta_description",
  "home_cta_button_text",
  "home_cta_link",
  "inquiry_transport_options",
] as const;

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
    about_image: "",
    footer_content: "",
    home_news_count: "3",
    home_news_rule: "top_then_fresh",
    advantages_section_title: "为什么选择我们",
    advantages_section_subtitle: "14年行业经验，值得信赖的物流合作伙伴",
    advantage_1_title: "时效保证",
    advantage_1_description: "14年丰富经验，专业团队操作，确保货物安全准时到达",
    advantage_2_title: "安全保障",
    advantage_2_description: "全程货物追踪，专业保险服务，让您安心托付",
    advantage_3_title: "网络覆盖",
    advantage_3_description: "欧洲全境派送网络，覆盖30+国家，门到门服务",
    advantage_4_title: "价格优惠",
    advantage_4_description: "一手庄家价格，无中间商赚差价，性价比更高",
    values_section_title: "核心价值观",
    value_1_title: "线路理解优先",
    value_1_description: "我们重视的不只是发货，而是对中欧线路、口岸节奏、清关要求和末端交付条件的真实理解。",
    value_2_title: "节点可控交付",
    value_2_description: "从提货、主程、清关到尾程预约，我们强调关键节点清晰、异常响应及时、交付结果可追踪。",
    value_3_title: "长期方案协同",
    value_3_description: "我们不只做单票运输，更关注客户长期补货节奏、仓配协同和整体物流成本优化。",
    capabilities_section_title: "我们的服务能力",
    capabilities_section_subtitle: "相比堆数字，我们更愿意把真正能影响交付结果的能力讲清楚。",
    capability_1_title: "多运输方式协同",
    capability_1_description: "覆盖中欧班列、卡航、海运、清关与尾程派送，可根据货物属性和交付节奏组合方案。",
    capability_2_title: "欧洲链路衔接能力",
    capability_2_description: "关注目的国清关要求、送仓预约、末端派送与仓配协同，减少运输断点。",
    capability_3_title: "面向B端复杂需求",
    capability_3_description: "可支持补货、项目货、门到门交付、多批次出运等更贴近企业采购场景的物流需求。",
    capability_4_title: "方案先行而非模板报价",
    capability_4_description: "在报价前优先确认品名、时效、交付地点与清关条件，让方案更接近真实落地。",
    audience_section_title: "这套方案适合谁",
    audience_section_subtitle: "如果你属于下面这些典型场景之一，这个站点里的服务内容基本就是为你准备的。",
    audience_1_title: "亚马逊 / 平台仓补货客户",
    audience_1_description: "适合关注补货节奏、入仓预约、断货风险和旺季交付稳定性的跨境电商客户。",
    audience_2_title: "工厂直发欧洲采购客户",
    audience_2_description: "适合需要从中国工厂出货，统一管理主程、清关和尾程交付的制造商与贸易商。",
    audience_3_title: "项目设备 / 工程交付客户",
    audience_3_description: "适合设备类、异形件、多批次到货和现场交付要求较高的项目型物流需求。",
    home_faq_1_question: "送亚马逊仓和送私人地址，方案上有什么区别？",
    home_faq_1_answer: "送仓通常更关注预约窗口、标签要求、上架时效与异常签收；送私人或商业地址则更关注尾程预约、派送范围与签收方式。发货前把收货类型说清楚，方案会更准确。",
    home_faq_2_question: "卡航、班列、海运在旺季应该怎么选？",
    home_faq_2_answer: "如果要保补货节奏，卡航通常更灵活；如果想在时效和成本之间做平衡，班列更稳；如果是大货备货且交期宽松，海运更有成本优势。旺季建议尽早锁定发运窗口。",
    home_faq_3_question: "哪些货物建议先做清关资料预审？",
    home_faq_3_answer: "高货值货物、品名复杂货物、带电/敏感属性货物、项目货以及首次出口到对应国家的货物，都建议先做资料预审，以减少清关阶段反复沟通。",
    home_faq_4_question: "项目货和普通贸易货的运输组织差别在哪里？",
    home_faq_4_answer: "项目货更关注尺寸重量、装卸方式、分批到货节奏、现场交接条件和节点控制，通常不能直接套用普通拼货或常规运输模板，需要先做专项方案。",
    home_cta_title: "不确定该走班列、卡航还是海运？",
    home_cta_description: "把货物品名、重量体积、目的地和时效要求发给我们，我们先帮你判断更合适的运输方案。",
    home_cta_button_text: "获取方案建议",
    home_cta_link: "/contact",
    inquiry_transport_options: "中欧班列\n卡航快递\n海运整拼柜\n派送到门\n项目货物运输\n欧盟清关\n其他",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/admin/config?keys=${SETTINGS_KEYS.join(",")}`);
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
            about_image: data.config.about_image || "",
            footer_content: data.config.footer_content || "",
            home_news_count: data.config.home_news_count || "3",
            home_news_rule: data.config.home_news_rule || "top_then_fresh",
            advantages_section_title: data.config.advantages_section_title || "为什么选择我们",
            advantages_section_subtitle: data.config.advantages_section_subtitle || "14年行业经验，值得信赖的物流合作伙伴",
            advantage_1_title: data.config.advantage_1_title || "时效保证",
            advantage_1_description: data.config.advantage_1_description || "14年丰富经验，专业团队操作，确保货物安全准时到达",
            advantage_2_title: data.config.advantage_2_title || "安全保障",
            advantage_2_description: data.config.advantage_2_description || "全程货物追踪，专业保险服务，让您安心托付",
            advantage_3_title: data.config.advantage_3_title || "网络覆盖",
            advantage_3_description: data.config.advantage_3_description || "欧洲全境派送网络，覆盖30+国家，门到门服务",
            advantage_4_title: data.config.advantage_4_title || "价格优惠",
            advantage_4_description: data.config.advantage_4_description || "一手庄家价格，无中间商赚差价，性价比更高",
            values_section_title: data.config.values_section_title || "核心价值观",
            value_1_title: data.config.value_1_title || "线路理解优先",
            value_1_description: data.config.value_1_description || "我们重视的不只是发货，而是对中欧线路、口岸节奏、清关要求和末端交付条件的真实理解。",
            value_2_title: data.config.value_2_title || "节点可控交付",
            value_2_description: data.config.value_2_description || "从提货、主程、清关到尾程预约，我们强调关键节点清晰、异常响应及时、交付结果可追踪。",
            value_3_title: data.config.value_3_title || "长期方案协同",
            value_3_description: data.config.value_3_description || "我们不只做单票运输，更关注客户长期补货节奏、仓配协同和整体物流成本优化。",
            capabilities_section_title: data.config.capabilities_section_title || "我们的服务能力",
            capabilities_section_subtitle: data.config.capabilities_section_subtitle || "相比堆数字，我们更愿意把真正能影响交付结果的能力讲清楚。",
            capability_1_title: data.config.capability_1_title || "多运输方式协同",
            capability_1_description: data.config.capability_1_description || "覆盖中欧班列、卡航、海运、清关与尾程派送，可根据货物属性和交付节奏组合方案。",
            capability_2_title: data.config.capability_2_title || "欧洲链路衔接能力",
            capability_2_description: data.config.capability_2_description || "关注目的国清关要求、送仓预约、末端派送与仓配协同，减少运输断点。",
            capability_3_title: data.config.capability_3_title || "面向B端复杂需求",
            capability_3_description: data.config.capability_3_description || "可支持补货、项目货、门到门交付、多批次出运等更贴近企业采购场景的物流需求。",
            capability_4_title: data.config.capability_4_title || "方案先行而非模板报价",
            capability_4_description: data.config.capability_4_description || "在报价前优先确认品名、时效、交付地点与清关条件，让方案更接近真实落地。",
            audience_section_title: data.config.audience_section_title || "这套方案适合谁",
            audience_section_subtitle: data.config.audience_section_subtitle || "如果你属于下面这些典型场景之一，这个站点里的服务内容基本就是为你准备的。",
            audience_1_title: data.config.audience_1_title || "亚马逊 / 平台仓补货客户",
            audience_1_description: data.config.audience_1_description || "适合关注补货节奏、入仓预约、断货风险和旺季交付稳定性的跨境电商客户。",
            audience_2_title: data.config.audience_2_title || "工厂直发欧洲采购客户",
            audience_2_description: data.config.audience_2_description || "适合需要从中国工厂出货，统一管理主程、清关和尾程交付的制造商与贸易商。",
            audience_3_title: data.config.audience_3_title || "项目设备 / 工程交付客户",
            audience_3_description: data.config.audience_3_description || "适合设备类、异形件、多批次到货和现场交付要求较高的项目型物流需求。",
            home_faq_1_question: data.config.home_faq_1_question || "送亚马逊仓和送私人地址，方案上有什么区别？",
            home_faq_1_answer: data.config.home_faq_1_answer || "送仓通常更关注预约窗口、标签要求、上架时效与异常签收；送私人或商业地址则更关注尾程预约、派送范围与签收方式。发货前把收货类型说清楚，方案会更准确。",
            home_faq_2_question: data.config.home_faq_2_question || "卡航、班列、海运在旺季应该怎么选？",
            home_faq_2_answer: data.config.home_faq_2_answer || "如果要保补货节奏，卡航通常更灵活；如果想在时效和成本之间做平衡，班列更稳；如果是大货备货且交期宽松，海运更有成本优势。旺季建议尽早锁定发运窗口。",
            home_faq_3_question: data.config.home_faq_3_question || "哪些货物建议先做清关资料预审？",
            home_faq_3_answer: data.config.home_faq_3_answer || "高货值货物、品名复杂货物、带电/敏感属性货物、项目货以及首次出口到对应国家的货物，都建议先做资料预审，以减少清关阶段反复沟通。",
            home_faq_4_question: data.config.home_faq_4_question || "项目货和普通贸易货的运输组织差别在哪里？",
            home_faq_4_answer: data.config.home_faq_4_answer || "项目货更关注尺寸重量、装卸方式、分批到货节奏、现场交接条件和节点控制，通常不能直接套用普通拼货或常规运输模板，需要先做专项方案。",
            home_cta_title: data.config.home_cta_title || "不确定该走班列、卡航还是海运？",
            home_cta_description: data.config.home_cta_description || "把货物品名、重量体积、目的地和时效要求发给我们，我们先帮你判断更合适的运输方案。",
            home_cta_button_text: data.config.home_cta_button_text || "获取方案建议",
            home_cta_link: data.config.home_cta_link || "/contact",
            inquiry_transport_options: data.config.inquiry_transport_options || "中欧班列\n卡航快递\n海运整拼柜\n派送到门\n项目货物运输\n欧盟清关\n其他",
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
          <div className="space-y-6">
            <ImageUploadField
              label="关于我们配图"
              value={settings.about_image}
              onChange={(value) => setSettings({ ...settings, about_image: value })}
              folder="media-library"
              hint="建议上传真实办公室、仓库、团队或物流现场图片；不传则前台显示品牌占位样式"
            />
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
        </div>

        {/* Homepage News */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页新闻推荐</h2>
          <div className="space-y-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">推荐规则</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, home_news_rule: "top_then_fresh" })}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${settings.home_news_rule === "top_then_fresh" ? "border-navy bg-navy/5 ring-2 ring-navy/10" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                >
                  <div className="text-sm font-medium text-gray-800">优先置顶，再按发布时间</div>
                  <div className="text-xs text-gray-500 mt-1">适合首页推荐位，手动控制重点内容</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, home_news_rule: "fresh_only" })}
                  className={`rounded-xl border px-4 py-3 text-left transition-all ${settings.home_news_rule === "fresh_only" ? "border-navy bg-navy/5 ring-2 ring-navy/10" : "border-gray-200 hover:border-gray-300 bg-white"}`}
                >
                  <div className="text-sm font-medium text-gray-800">只按发布时间</div>
                  <div className="text-xs text-gray-500 mt-1">忽略置顶顺序，最新发布的新闻优先</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advantages */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页 - 为什么选择我们</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块标题</label>
              <input
                type="text"
                value={settings.advantages_section_title}
                onChange={(e) => setSettings({ ...settings, advantages_section_title: e.target.value })}
                className="input-field"
                placeholder="为什么选择我们"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块副标题</label>
              <textarea
                value={settings.advantages_section_subtitle}
                onChange={(e) => setSettings({ ...settings, advantages_section_subtitle: e.target.value })}
                rows={2}
                className="input-field resize-none"
                placeholder="14年行业经验，值得信赖的物流合作伙伴"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">优势卡片 1（时钟图标）</label>
                <input type="text" value={settings.advantage_1_title} onChange={(e) => setSettings({ ...settings, advantage_1_title: e.target.value })} className="input-field" placeholder="时效保证" />
                <textarea value={settings.advantage_1_description} onChange={(e) => setSettings({ ...settings, advantage_1_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">优势卡片 2（盾牌图标）</label>
                <input type="text" value={settings.advantage_2_title} onChange={(e) => setSettings({ ...settings, advantage_2_title: e.target.value })} className="input-field" placeholder="安全保障" />
                <textarea value={settings.advantage_2_description} onChange={(e) => setSettings({ ...settings, advantage_2_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">优势卡片 3（地球图标）</label>
                <input type="text" value={settings.advantage_3_title} onChange={(e) => setSettings({ ...settings, advantage_3_title: e.target.value })} className="input-field" placeholder="网络覆盖" />
                <textarea value={settings.advantage_3_description} onChange={(e) => setSettings({ ...settings, advantage_3_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">优势卡片 4（趋势图标）</label>
                <input type="text" value={settings.advantage_4_title} onChange={(e) => setSettings({ ...settings, advantage_4_title: e.target.value })} className="input-field" placeholder="价格优惠" />
                <textarea value={settings.advantage_4_description} onChange={(e) => setSettings({ ...settings, advantage_4_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="请输入描述" />
              </div>
            </div>
          </div>
        </div>

        {/* About Capabilities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">关于我们 - 服务能力说明区</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块标题</label>
              <input
                type="text"
                value={settings.capabilities_section_title}
                onChange={(e) => setSettings({ ...settings, capabilities_section_title: e.target.value })}
                className="input-field"
                placeholder="我们的服务能力"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块副标题</label>
              <textarea
                value={settings.capabilities_section_subtitle}
                onChange={(e) => setSettings({ ...settings, capabilities_section_subtitle: e.target.value })}
                rows={2}
                className="input-field resize-none"
                placeholder="相比堆数字，我们更愿意把真正能影响交付结果的能力讲清楚。"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">能力卡片 1（趋势图标）</label>
                <input type="text" value={settings.capability_1_title} onChange={(e) => setSettings({ ...settings, capability_1_title: e.target.value })} className="input-field" placeholder="多运输方式协同" />
                <textarea value={settings.capability_1_description} onChange={(e) => setSettings({ ...settings, capability_1_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">能力卡片 2（地球图标）</label>
                <input type="text" value={settings.capability_2_title} onChange={(e) => setSettings({ ...settings, capability_2_title: e.target.value })} className="input-field" placeholder="欧洲链路衔接能力" />
                <textarea value={settings.capability_2_description} onChange={(e) => setSettings({ ...settings, capability_2_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">能力卡片 3（用户图标）</label>
                <input type="text" value={settings.capability_3_title} onChange={(e) => setSettings({ ...settings, capability_3_title: e.target.value })} className="input-field" placeholder="面向B端复杂需求" />
                <textarea value={settings.capability_3_description} onChange={(e) => setSettings({ ...settings, capability_3_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">能力卡片 4（奖章图标）</label>
                <input type="text" value={settings.capability_4_title} onChange={(e) => setSettings({ ...settings, capability_4_title: e.target.value })} className="input-field" placeholder="方案先行而非模板报价" />
                <textarea value={settings.capability_4_description} onChange={(e) => setSettings({ ...settings, capability_4_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
            </div>
          </div>
        </div>

        {/* About Values */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">关于我们 - 核心价值观</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块标题</label>
              <input
                type="text"
                value={settings.values_section_title}
                onChange={(e) => setSettings({ ...settings, values_section_title: e.target.value })}
                className="input-field"
                placeholder="核心价值观"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">价值观 1（用户图标）</label>
                <input type="text" value={settings.value_1_title} onChange={(e) => setSettings({ ...settings, value_1_title: e.target.value })} className="input-field" placeholder="线路理解优先" />
                <textarea value={settings.value_1_description} onChange={(e) => setSettings({ ...settings, value_1_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">价值观 2（趋势图标）</label>
                <input type="text" value={settings.value_2_title} onChange={(e) => setSettings({ ...settings, value_2_title: e.target.value })} className="input-field" placeholder="节点可控交付" />
                <textarea value={settings.value_2_description} onChange={(e) => setSettings({ ...settings, value_2_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">价值观 3（地球图标）</label>
                <input type="text" value={settings.value_3_title} onChange={(e) => setSettings({ ...settings, value_3_title: e.target.value })} className="input-field" placeholder="长期方案协同" />
                <textarea value={settings.value_3_description} onChange={(e) => setSettings({ ...settings, value_3_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
            </div>
          </div>
        </div>

        {/* Home Audience */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页 - 这套方案适合谁</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块标题</label>
              <input type="text" value={settings.audience_section_title} onChange={(e) => setSettings({ ...settings, audience_section_title: e.target.value })} className="input-field" placeholder="这套方案适合谁" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">区块副标题</label>
              <textarea value={settings.audience_section_subtitle} onChange={(e) => setSettings({ ...settings, audience_section_subtitle: e.target.value })} rows={2} className="input-field resize-none" placeholder="请输入说明" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">客户类型 1</label>
                <input type="text" value={settings.audience_1_title} onChange={(e) => setSettings({ ...settings, audience_1_title: e.target.value })} className="input-field" placeholder="亚马逊 / 平台仓补货客户" />
                <textarea value={settings.audience_1_description} onChange={(e) => setSettings({ ...settings, audience_1_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">客户类型 2</label>
                <input type="text" value={settings.audience_2_title} onChange={(e) => setSettings({ ...settings, audience_2_title: e.target.value })} className="input-field" placeholder="工厂直发欧洲采购客户" />
                <textarea value={settings.audience_2_description} onChange={(e) => setSettings({ ...settings, audience_2_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">客户类型 3</label>
                <input type="text" value={settings.audience_3_title} onChange={(e) => setSettings({ ...settings, audience_3_title: e.target.value })} className="input-field" placeholder="项目设备 / 工程交付客户" />
                <textarea value={settings.audience_3_description} onChange={(e) => setSettings({ ...settings, audience_3_description: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入描述" />
              </div>
            </div>
          </div>
        </div>

        {/* Home FAQ */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页 - 常见问题 FAQ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">问题 1</label>
              <input type="text" value={settings.home_faq_1_question} onChange={(e) => setSettings({ ...settings, home_faq_1_question: e.target.value })} className="input-field" placeholder="请输入问题" />
              <textarea value={settings.home_faq_1_answer} onChange={(e) => setSettings({ ...settings, home_faq_1_answer: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入答案" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">问题 2</label>
              <input type="text" value={settings.home_faq_2_question} onChange={(e) => setSettings({ ...settings, home_faq_2_question: e.target.value })} className="input-field" placeholder="请输入问题" />
              <textarea value={settings.home_faq_2_answer} onChange={(e) => setSettings({ ...settings, home_faq_2_answer: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入答案" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">问题 3</label>
              <input type="text" value={settings.home_faq_3_question} onChange={(e) => setSettings({ ...settings, home_faq_3_question: e.target.value })} className="input-field" placeholder="请输入问题" />
              <textarea value={settings.home_faq_3_answer} onChange={(e) => setSettings({ ...settings, home_faq_3_answer: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入答案" />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">问题 4</label>
              <input type="text" value={settings.home_faq_4_question} onChange={(e) => setSettings({ ...settings, home_faq_4_question: e.target.value })} className="input-field" placeholder="请输入问题" />
              <textarea value={settings.home_faq_4_answer} onChange={(e) => setSettings({ ...settings, home_faq_4_answer: e.target.value })} rows={4} className="input-field resize-none" placeholder="请输入答案" />
            </div>
          </div>
        </div>

        {/* Home CTA */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">首页 - 底部行动引导</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
              <input type="text" value={settings.home_cta_title} onChange={(e) => setSettings({ ...settings, home_cta_title: e.target.value })} className="input-field" placeholder="不确定该走班列、卡航还是海运？" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">说明文案</label>
              <textarea value={settings.home_cta_description} onChange={(e) => setSettings({ ...settings, home_cta_description: e.target.value })} rows={3} className="input-field resize-none" placeholder="请输入说明" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">按钮文字</label>
                <input type="text" value={settings.home_cta_button_text} onChange={(e) => setSettings({ ...settings, home_cta_button_text: e.target.value })} className="input-field" placeholder="获取方案建议" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">按钮链接</label>
                <input type="text" value={settings.home_cta_link} onChange={(e) => setSettings({ ...settings, home_cta_link: e.target.value })} className="input-field" placeholder="/contact" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-navy mb-6">在线询价设置</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">可选运输方式</label>
            <textarea
              value={settings.inquiry_transport_options}
              onChange={(e) =>
                setSettings({ ...settings, inquiry_transport_options: e.target.value })
              }
              rows={8}
              className="input-field resize-none"
              placeholder={"中欧班列\n卡航快递\n海运整拼柜\n派送到门\n项目货物运输\n欧盟清关\n其他"}
            />
            <p className="mt-2 text-xs text-gray-500">每行一个选项，前台在线询价表单会自动读取这里的运输方式列表。</p>
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
