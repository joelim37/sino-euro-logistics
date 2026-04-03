"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, Search, Mail, Phone, CheckCheck, Copy, Eye, X, Clock3, MapPinned, Package2, Truck, AlertCircle, CircleCheckBig } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  origin: string;
  destination: string;
  service_type: string;
  cargo_name?: string;
  hs_code?: string;
  package_type?: string;
  dimensions?: string;
  weight?: string;
  transport_mode?: string;
  delivery_mode?: string;
  attachment_urls?: string;
  notes: string;
  status: "pending" | "contacted" | "completed";
  created_at: string;
}

const statusLabels = {
  pending: "未处理",
  contacted: "已联系",
  completed: "已成单",
};

const statusClasses = {
  pending: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

function getHoursSince(createdAt: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60)));
}

function getLeadPriority(inquiry: Inquiry) {
  let score = 0;
  if (inquiry.phone) score += 2;
  if (inquiry.company) score += 1;
  if (inquiry.cargo_name) score += 1;
  if (inquiry.hs_code) score += 1;
  if (inquiry.dimensions) score += 1;
  if (inquiry.weight) score += 1;
  if (inquiry.transport_mode) score += 1;
  if (inquiry.delivery_mode) score += 1;
  if (inquiry.notes && inquiry.notes.trim().length >= 20) score += 1;

  if (score >= 7) return { label: "高意向", className: "bg-red-100 text-red-700 border-red-200" };
  if (score >= 4) return { label: "中意向", className: "bg-orange-100 text-orange-700 border-orange-200" };
  return { label: "普通", className: "bg-gray-100 text-gray-700 border-gray-200" };
}

function getFollowUpChecklist(inquiry: Inquiry) {
  return [
    { label: "已留电话", done: Boolean(inquiry.phone) },
    { label: "已留公司名", done: Boolean(inquiry.company) },
    { label: "已写货物品名", done: Boolean(inquiry.cargo_name) },
    { label: "已写海关编码", done: Boolean(inquiry.hs_code) },
    { label: "已写包装类型", done: Boolean(inquiry.package_type) },
    { label: "已写尺寸重量", done: Boolean(inquiry.dimensions || inquiry.weight) },
    { label: "已写运输类型", done: Boolean(inquiry.transport_mode) },
    { label: "已写交付方式", done: Boolean(inquiry.delivery_mode) },
    { label: "已上传附件", done: Boolean(inquiry.attachment_urls) },
  ];
}

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [copyNotice, setCopyNotice] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/admin/inquiries");
      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: "pending" | "contacted" | "completed") => {
    try {
      const response = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await fetchInquiries();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const exportToCSV = () => {
    window.open("/api/admin/inquiries?export=csv", "_blank");
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredInquiries.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(filteredInquiries.map((item) => item.id));
  };

  const handleBatchStatusChange = async (status: "pending" | "contacted" | "completed") => {
    if (selectedIds.length === 0) return;
    setIsBatchUpdating(true);

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch("/api/admin/inquiries", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
          })
        )
      );
      setSelectedIds([]);
      await fetchInquiries();
      if (activeInquiry && selectedIds.includes(activeInquiry.id)) {
        setActiveInquiry((prev) => (prev ? { ...prev, status } : prev));
      }
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const handleCopy = async (label: string, value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopyNotice(`${label}已复制`);
      setTimeout(() => setCopyNotice(""), 1500);
    } catch {
      setCopyNotice(`复制${label}失败`);
      setTimeout(() => setCopyNotice(""), 1500);
    }
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cargo_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hs_code?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <h1 className="text-2xl font-serif text-navy font-bold">询价记录</h1>
        <p className="text-gray-500 mt-1">管理客户提交的询价信息，优先处理新的和高意向的需求。</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">总询价</p>
          <p className="text-2xl font-bold text-navy">{inquiries.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">未处理</p>
          <p className="text-2xl font-bold text-yellow-600">
            {inquiries.filter((i) => i.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">已完成</p>
          <p className="text-2xl font-bold text-green-600">
            {inquiries.filter((i) => i.status === "completed").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名、公司、邮箱、目的地、品名、海关编码..."
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["all", "pending", "contacted", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-navy text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status === "all" ? "全部" : statusLabels[status]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("pending")}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-yellow-200 text-yellow-700 rounded-lg hover:bg-yellow-50"
            >
              <span>只看待处理</span>
            </button>
            <button
              onClick={() => handleBatchStatusChange("contacted")}
              disabled={selectedIds.length === 0 || isBatchUpdating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span>批量标记已联系</span>
            </button>
            <button
              onClick={() => handleBatchStatusChange("completed")}
              disabled={selectedIds.length === 0 || isBatchUpdating}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              <span>批量标记已成单</span>
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold-dark transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>导出 CSV</span>
            </button>
          </div>
        </div>
      </div>

      {copyNotice && (
        <div className="mb-4 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-sm inline-block">
          {copyNotice}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                  <input
                    type="checkbox"
                    checked={filteredInquiries.length > 0 && selectedIds.length === filteredInquiries.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">提交时间</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">客户</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">联系方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">路线</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">运输需求</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">意向</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">状态</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => {
                  const priority = getLeadPriority(inquiry);
                  return (
                    <tr key={inquiry.id} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(inquiry.id)}
                          onChange={() => toggleSelected(inquiry.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        <div>{new Date(inquiry.created_at).toLocaleString("zh-CN")}</div>
                        <div className="text-xs text-gray-400 mt-1">{getHoursSince(inquiry.created_at)} 小时前</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-navy">{inquiry.name}</div>
                        <div className="text-gray-500 mt-1">{inquiry.company || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-gray-600 break-all">{inquiry.email}</div>
                        <div className="text-gray-500 mt-1">{inquiry.phone || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="text-gray-600">{inquiry.origin || "-"}</div>
                        <div className="text-gold mt-1">→ {inquiry.destination}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>{inquiry.service_type || "-"}</div>
                        <div className="text-xs text-gray-500 mt-1">{inquiry.transport_mode || "-"} / {inquiry.delivery_mode || "-"}</div>
                        <div className="text-xs text-gray-500 mt-1">{inquiry.cargo_name || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${priority.className}`}>
                          {priority.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={inquiry.status}
                          onChange={(e) =>
                            handleStatusChange(
                              inquiry.id,
                              e.target.value as "pending" | "contacted" | "completed"
                            )
                          }
                          className={`text-sm rounded-lg px-2 py-1 border-0 cursor-pointer ${statusClasses[inquiry.status]}`}
                        >
                          <option value="pending">未处理</option>
                          <option value="contacted">已联系</option>
                          <option value="completed">已成单</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setActiveInquiry(inquiry)}
                            className="p-1 text-navy hover:bg-gray-100 rounded"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {inquiry.phone && (
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="拨打电话"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="发送邮件"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeInquiry && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
          <div className="w-full max-w-2xl h-full bg-[#f8fafc] shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-2xl font-serif text-navy font-bold">{activeInquiry.company || activeInquiry.name}</h2>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClasses[activeInquiry.status]}`}>
                      {statusLabels[activeInquiry.status]}
                    </span>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getLeadPriority(activeInquiry).className}`}>
                      {getLeadPriority(activeInquiry).label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(activeInquiry.created_at).toLocaleString("zh-CN")} · {getHoursSince(activeInquiry.created_at)} 小时前提交</p>
                </div>
                <button type="button" onClick={() => setActiveInquiry(null)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Clock3 className="w-4 h-4" /> 跟进时效</div>
                  <div className="text-lg font-semibold text-navy">{getHoursSince(activeInquiry.created_at)} 小时</div>
                  <div className="text-xs text-gray-500 mt-1">建议优先联系新线索</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><MapPinned className="w-4 h-4" /> 目的地</div>
                  <div className="text-lg font-semibold text-navy">{activeInquiry.destination || "-"}</div>
                  <div className="text-xs text-gray-500 mt-1">起点：{activeInquiry.origin || "-"}</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Truck className="w-4 h-4" /> 运输偏好</div>
                  <div className="text-lg font-semibold text-navy">{activeInquiry.transport_mode || "未写"}</div>
                  <div className="text-xs text-gray-500 mt-1">{activeInquiry.delivery_mode || "未写"}</div>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs mb-2"><Package2 className="w-4 h-4" /> 货物信息</div>
                  <div className="text-lg font-semibold text-navy">{activeInquiry.cargo_name || "未写"}</div>
                  <div className="text-xs text-gray-500 mt-1">HS：{activeInquiry.hs_code || "未写"}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-navy">跟单操作</h3>
                      <select
                        value={activeInquiry.status}
                        onChange={async (e) => {
                          const status = e.target.value as "pending" | "contacted" | "completed";
                          await handleStatusChange(activeInquiry.id, status);
                          setActiveInquiry({ ...activeInquiry, status });
                        }}
                        className={`rounded-lg px-3 py-2 text-sm font-medium outline-none ${statusClasses[activeInquiry.status]}`}
                      >
                        <option value="pending">未处理</option>
                        <option value="contacted">已联系</option>
                        <option value="completed">已成单</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {activeInquiry.phone ? (
                        <a href={`tel:${activeInquiry.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                          <Phone className="w-4 h-4" /> 立即拨打
                        </a>
                      ) : null}
                      <a href={`mailto:${activeInquiry.email}`} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        <Mail className="w-4 h-4" /> 发送邮件
                      </a>
                      <button onClick={() => handleCopy("邮箱", activeInquiry.email)} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                        <Copy className="w-4 h-4" /> 复制邮箱
                      </button>
                      {activeInquiry.phone ? (
                        <button onClick={() => handleCopy("电话", activeInquiry.phone)} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                          <Copy className="w-4 h-4" /> 复制电话
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">客户资料</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">联系人</p>
                        <p className="text-navy font-medium">{activeInquiry.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">公司名称</p>
                        <p className="text-navy">{activeInquiry.company || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">电话</p>
                        <p className="text-navy">{activeInquiry.phone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">邮箱</p>
                        <p className="text-navy break-all">{activeInquiry.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">运输需求明细</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">货物起点</p>
                        <p className="text-navy">{activeInquiry.origin || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">目的地</p>
                        <p className="text-navy">{activeInquiry.destination || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">运输方式</p>
                        <p className="text-navy">{activeInquiry.service_type || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">运输类型</p>
                        <p className="text-navy">{activeInquiry.transport_mode || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">交付方式</p>
                        <p className="text-navy">{activeInquiry.delivery_mode || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">包装类型</p>
                        <p className="text-navy">{activeInquiry.package_type || "未指定"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">货物品名</p>
                        <p className="text-navy">{activeInquiry.cargo_name || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">海关编码</p>
                        <p className="text-navy">{activeInquiry.hs_code || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">箱子尺寸</p>
                        <p className="text-navy">{activeInquiry.dimensions || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">箱子重量</p>
                        <p className="text-navy">{activeInquiry.weight || "-"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">客户附件</h3>
                    <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap break-all">{activeInquiry.attachment_urls || "客户没有上传附件"}</p>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">客户备注 / 需求补充</h3>
                    <p className="text-sm text-gray-600 leading-7 whitespace-pre-wrap">{activeInquiry.notes || "客户没有填写备注"}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">跟单完整度</h3>
                    <div className="space-y-3">
                      {getFollowUpChecklist(activeInquiry).map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-bg px-3 py-2">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          {item.done ? (
                            <CircleCheckBig className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-5">
                    <h3 className="text-lg font-semibold text-navy mb-4">业务建议</h3>
                    <ul className="space-y-3 text-sm text-gray-600 leading-6">
                      <li>• 先确认是否要门到门，避免报价口径不一致。</li>
                      <li>• 若有 HS 编码和包装类型，可更快判断清关与装载方式。</li>
                      <li>• 尺寸重量已提供时，优先判断整柜/拼箱是否合理。</li>
                      <li>• 没留电话的线索，建议优先邮件回复并补齐联系方式。</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
