import { db } from "@/db";
import { users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();

  if (session?.role !== "admin") {
    redirect("/dashboard");
  }

  const allUsers = await db.select().from(users);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Settings className="w-7 h-7 text-gray-600" />
          Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage user access and system settings</p>
      </div>

      <SettingsClient users={allUsers} currentUserId={session.id} />
    </div>
  );
}
