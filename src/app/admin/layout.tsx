"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Image,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Truck,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/banner", label: "Banner管理", icon: Image },
  { href: "/admin/services", label: "服务管理", icon: Package },
  { href: "/admin/inquiries", label: "询价记录", icon: MessageSquare },
  { href: "/admin/settings", label: "网站设置", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile Header */}
      <div className="lg:hidden bg-navy text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SE</span>
          </div>
          <span className="font-serif font-bold">管理后台</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white transform transition-transform duration-300 lg:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SE</span>
                </div>
                <div>
                  <h1 className="font-serif font-bold">管理后台</h1>
                  <p className="text-xs text-gray-400">中欧通联物流</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gold text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-gold font-bold">
                    {session.user?.name?.[0] || "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.user?.name || "管理员"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
