"use client";

import { useState } from "react";
import { updateUserRole, toggleUserStatus } from "./actions";
import { Shield, Users, CheckCircle, XCircle, Settings } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "manager" | "supervisor" | "worker";
  isActive: boolean;
  createdAt: Date | null;
}

interface SettingsClientProps {
  users: User[];
  currentUserId: number;
}

const roleDescriptions = {
  admin: "Full access to all features including user management",
  manager: "Can manage flocks, feed, employees, and view all reports",
  supervisor: "Can record mortality, egg production, and manage flocks",
  worker: "Can record daily data (mortality, egg production)",
};

const roleColors = {
  admin: "bg-yellow-100 text-yellow-800 border-yellow-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  supervisor: "bg-purple-100 text-purple-800 border-purple-200",
  worker: "bg-green-100 text-green-800 border-green-200",
};

export default function SettingsClient({ users, currentUserId }: SettingsClientProps) {
  const [loading, setLoading] = useState<number | null>(null);

  async function handleRoleChange(userId: number, role: string) {
    setLoading(userId);
    const formData = new FormData();
    formData.set("userId", userId.toString());
    formData.set("role", role);
    await updateUserRole(formData);
    setLoading(null);
  }

  async function handleToggleStatus(userId: number, isActive: boolean) {
    setLoading(userId);
    const formData = new FormData();
    formData.set("userId", userId.toString());
    formData.set("isActive", isActive.toString());
    await toggleUserStatus(formData);
    setLoading(null);
  }

  return (
    <div className="space-y-6">
      {/* Role Legend */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-green-600" />
          Access Level Guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(roleDescriptions).map(([role, desc]) => (
            <div key={role} className={`p-3 rounded-xl border ${roleColors[role as keyof typeof roleColors]}`}>
              <p className="font-semibold capitalize">{role}</p>
              <p className="text-sm mt-0.5 opacity-80">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-green-600" />
          User Access Management
        </h2>

        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-all ${
                user.isActive ? "bg-white border-green-100" : "bg-gray-50 border-gray-200 opacity-70"
              }`}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  user.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                }`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    {user.id === currentUserId && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">You</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Role Selector */}
              <div className="flex items-center gap-3">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.id === currentUserId || loading === user.id}
                  className={`form-input text-sm py-1.5 w-36 ${roleColors[user.role]}`}
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="worker">Worker</option>
                </select>

                {/* Status Toggle */}
                {user.id !== currentUserId && (
                  <button
                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                    disabled={loading === user.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      user.isActive
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    {loading === user.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : user.isActive ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                )}

                {/* Status Badge */}
                <span className={`badge ${user.isActive ? "badge-green" : "badge-red"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Info */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-green-600" />
          System Information
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: users.length },
            { label: "Active Users", value: users.filter((u) => u.isActive).length },
            { label: "Admins", value: users.filter((u) => u.role === "admin").length },
            { label: "Workers", value: users.filter((u) => u.role === "worker").length },
          ].map((stat) => (
            <div key={stat.label} className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
