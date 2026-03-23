"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Newspaper, Package, TrendingUp, Clock } from "lucide-react";
import { toAdminPath } from "@/lib/admin-path";

interface DashboardData {
  stats: {
    totalInquiries: number;
    pendingInquiries: number;
    completedInquiries: number;
    recent7dInquiries: number;
    totalNews: number;
    publishedNews: number;
    draftNews: number;
    activeServices: number;
  };
  recentInquiries: Array<{
    id: string;
    name: string;
    company?: string;
    destination?: string;
    service_type?: string;
    status: string;
    created_at: string;
  }>;
  recentNews: Array<{
    id: string;
    title: string;
    status: string;
    published_at?: string;
    created_at: string;
  }>;
}

const statCards = [
  { key: "pendingInquiries", label: "待处理询盘", icon: Clock, color: "text-yellow-600 bg-yellow-50" },
  { key: "recent7dInquiries", label: "近 7 天询盘", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
  { key: "publishedNews", label: "已发布新闻", icon: Newspaper, color: "text-green-600 bg-green-50" },
  { key: "activeServices", label: "启用服务", icon: Package, color: "text-purple-600 bg-purple-50" },
] as const;

const statusLabels: Record<string, string> = {
  pending: "未处理",
  contacted: "已联系",
  completed: "已成单",
  draft: "草稿",
  published: "已发布",
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-gray-500">后台数据加载失败</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif text-navy font-bold">后台概览</h1>
        <p className="text-gray-500 mt-1">先看询盘、内容和服务状态，再决定今天优先处理什么。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = data.stats[card.key];
          return (
            <div key={card.key} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-3xl font-bold text-navy">{value}</span>
              </div>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-navy">最近询盘</h2>
              <p className="text-sm text-gray-500">优先跟进最新客户需求</p>
            </div>
            <Link href={toAdminPath("/inquiries")} className="text-sm text-gold hover:underline">
              去处理
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentInquiries.length === 0 ? (
              <div className="text-sm text-gray-500">还没有询盘记录</div>
            ) : (
              data.recentInquiries.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-100 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="w-4 h-4 text-gold" />
                      <span className="font-medium text-navy">{item.company || item.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.destination || "未填写目的地"} · {item.service_type || "未指定服务"}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString("zh-CN")}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs bg-bg text-navy self-start md:self-auto">
                    {statusLabels[item.status] || item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-navy">内容状态</h2>
            <p className="text-sm text-gray-500">新闻和服务维护一眼看清</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="rounded-xl bg-bg p-4">
              <p className="text-sm text-gray-500">新闻总数</p>
              <p className="text-2xl font-bold text-navy">{data.stats.totalNews}</p>
              <p className="text-xs text-gray-500 mt-1">已发布 {data.stats.publishedNews} · 草稿 {data.stats.draftNews}</p>
            </div>
            <div className="rounded-xl bg-bg p-4">
              <p className="text-sm text-gray-500">服务数量</p>
              <p className="text-2xl font-bold text-navy">{data.stats.activeServices}</p>
              <p className="text-xs text-gray-500 mt-1">当前启用中的前台服务项</p>
            </div>
          </div>

          <div className="space-y-3">
            {data.recentNews.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 p-3">
                <p className="text-sm font-medium text-navy line-clamp-2">{item.title}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{statusLabels[item.status] || item.status}</span>
                  <span>{new Date(item.published_at || item.created_at).toLocaleDateString("zh-CN")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
