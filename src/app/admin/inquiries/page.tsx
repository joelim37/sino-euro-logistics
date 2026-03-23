"use client";

import { useState, useEffect } from "react";
import { Loader2, Download, Search, Mail, Phone, CheckCheck } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  origin: string;
  destination: string;
  service_type: string;
  notes: string;
  status: "pending" | "contacted" | "completed";
  created_at: string;
}

export default function InquiriesAdminPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "contacted" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchUpdating, setIsBatchUpdating] = useState(false);

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
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const statusLabels = {
    pending: "未处理",
    contacted: "已联系",
    completed: "已成单",
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      searchTerm === "" ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchTerm.toLowerCase());
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
        <p className="text-gray-500 mt-1">管理客户提交的询价信息</p>
      </div>

      {/* Stats */}
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索姓名、公司、邮箱、目的地..."
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
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

      {/* Table */}
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
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">姓名</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">公司</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">联系方式</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">路线</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">运输方式</th>
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
                filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inquiry.id)}
                        onChange={() => toggleSelected(inquiry.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(inquiry.created_at).toLocaleString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-navy">
                      {inquiry.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inquiry.company || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="text-gray-600">{inquiry.email}</p>
                        <p className="text-gray-500">{inquiry.phone || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p className="text-gray-600">{inquiry.origin || "-"}</p>
                        <p className="text-gold">→ {inquiry.destination}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {inquiry.service_type || "-"}
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
                        className={`text-sm rounded-lg px-2 py-1 border-0 cursor-pointer ${
                          inquiry.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : inquiry.status === "contacted"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        <option value="pending">未处理</option>
                        <option value="contacted">已联系</option>
                        <option value="completed">已成单</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
