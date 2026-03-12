"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus, Loader2, Edit2, X } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  icon: string;
  image: string;
  transit_time: string;
  suitable_for: string;
  sort_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "train", label: "火车" },
  { value: "truck", label: "卡车" },
  { value: "ship", label: "轮船" },
  { value: "file-check", label: "清关" },
];

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const createEmptyService = (): Service => ({
    id: "",
    name: "",
    slug: "",
    description: "",
    content: "",
    icon: "train",
    image: "",
    transit_time: "",
    suitable_for: "",
    sort_order: services.length + 1,
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingService) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: editingService.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingService),
      });

      if (response.ok) {
        await fetchServices();
        setEditingService(null);
      }
    } catch (error) {
      console.error("Error saving service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个服务吗？")) return;

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-navy font-bold">服务管理</h1>
          <p className="text-gray-500 mt-1">管理服务项目展示内容</p>
        </div>
        <button onClick={() => setEditingService(createEmptyService())} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增服务
        </button>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="relative h-40">
              <Image
                src={service.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"}
                alt={service.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => setEditingService(service)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4 text-navy" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 bg-white rounded-lg shadow hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-navy font-bold mb-2">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gold font-medium">
                  时效：{service.transit_time || "-"}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    service.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {service.is_active ? "启用" : "禁用"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-navy font-bold">
                  编辑服务
                </h2>
                <button
                  onClick={() => setEditingService(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      服务名称
                    </label>
                    <input
                      type="text"
                      value={editingService.name}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          name: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={editingService.slug}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          slug: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    简短描述
                  </label>
                  <input
                    type="text"
                    value={editingService.description}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    详细内容
                  </label>
                  <textarea
                    value={editingService.content}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      图标
                    </label>
                    <select
                      value={editingService.icon}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          icon: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      参考时效
                    </label>
                    <input
                      type="text"
                      value={editingService.transit_time}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          transit_time: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder="如：14-18天"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    适合货物
                  </label>
                  <input
                    type="text"
                    value={editingService.suitable_for}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        suitable_for: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>

                <ImageUploadField
                  label="服务图片"
                  value={editingService.image}
                  onChange={(value) =>
                    setEditingService({
                      ...editingService,
                      image: value,
                    })
                  }
                  folder="services"
                  hint="可直接上传电脑本地图片"
                />

                <div className="flex items-center gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingService.is_active}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-gold rounded"
                    />
                    <span className="text-sm text-gray-700">启用</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
