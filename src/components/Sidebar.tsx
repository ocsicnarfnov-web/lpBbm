"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Building2,
  Bird,
  Wheat,
  Skull,
  Egg,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  userName: string;
  userRole: string;
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/farm-profile", icon: Building2, label: "Farm Profile" },
  { href: "/dashboard/flock", icon: Bird, label: "Flock Management" },
  { href: "/dashboard/feed", icon: Wheat, label: "Feed Management" },
  { href: "/dashboard/mortality", icon: Skull, label: "Mortality" },
  { href: "/dashboard/egg-production", icon: Egg, label: "Egg Production" },
  { href: "/dashboard/employees", icon: Users, label: "Employees" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const roleColors: Record<string, string> = {
  admin: "bg-yellow-400 text-yellow-900",
  manager: "bg-blue-400 text-blue-900",
  supervisor: "bg-purple-400 text-purple-900",
  worker: "bg-green-400 text-green-900",
};

interface SidebarContentProps {
  userName: string;
  userRole: string;
  pathname: string;
  onNavClick: () => void;
}

function SidebarContent({ userName, userRole, pathname, onNavClick }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400 rounded-xl flex items-center justify-center text-xl">
            🐔
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">BreederPro</h1>
            <p className="text-green-300 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-green-400 rounded-full flex items-center justify-center text-green-900 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{userName}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[userRole] || "bg-green-400 text-green-900"}`}>
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? "bg-white/15 text-white border-l-4 border-green-400"
                  : "text-green-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-green-400" : "text-green-300 group-hover:text-green-400"}`} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto text-green-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-green-700">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-green-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-green-700 text-white rounded-lg flex items-center justify-center shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed left-0 top-0 h-full w-64 bg-green-800 z-40 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          userName={userName}
          userRole={userRole}
          pathname={pathname}
          onNavClick={() => setMobileOpen(false)}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-green-800 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent
          userName={userName}
          userRole={userRole}
          pathname={pathname}
          onNavClick={() => {}}
        />
      </div>
    </>
  );
}
