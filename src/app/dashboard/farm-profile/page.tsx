import { db } from "@/db";
import { farmProfile } from "@/db/schema";
import { getSession } from "@/lib/auth";
import FarmProfileForm from "./FarmProfileForm";
import { Building2 } from "lucide-react";

export default async function FarmProfilePage() {
  const session = await getSession();
  const profile = await db.select().from(farmProfile).get();

  const canEdit = session?.role === "admin" || session?.role === "manager";

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Building2 className="w-7 h-7 text-green-600" />
          Farm Profile
        </h1>
        <p className="text-gray-500 mt-1">Manage your farm information and branding</p>
      </div>

      <div className="card">
        {profile && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-center gap-4">
            {profile.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.logoUrl}
                alt="Farm Logo"
                className="w-16 h-16 rounded-xl object-cover border-2 border-green-200"
              />
            ) : (
              <div className="w-16 h-16 bg-green-200 rounded-xl flex items-center justify-center text-3xl">
                🏡
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{profile.farmName}</h2>
              <p className="text-gray-500 text-sm">{profile.farmAddress}</p>
            </div>
          </div>
        )}

        <FarmProfileForm profile={profile} canEdit={canEdit} />
      </div>
    </div>
  );
}
