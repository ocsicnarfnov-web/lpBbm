import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { flocks, employees, eggProduction, mortalityRecords } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Bird, Users, Egg, Skull, TrendingUp, Calendar } from "lucide-react";

function calcAgeWeeks(loadingDate: Date): number {
  const now = new Date();
  const loadDate = new Date(loadingDate);
  return Math.floor((now.getTime() - loadDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export default async function DashboardPage() {
  const session = await getSession();

  const [allFlocks, allEmployees, recentEggs, recentMortality] = await Promise.all([
    db.select().from(flocks).where(eq(flocks.isActive, true)),
    db.select().from(employees),
    db.select().from(eggProduction).orderBy(desc(eggProduction.recordDate)).limit(5),
    db.select().from(mortalityRecords).orderBy(desc(mortalityRecords.recordDate)).limit(5),
  ]);

  const activeEmployees = allEmployees.filter((e) => e.status === "active");
  const totalHatchingEggs = recentEggs.reduce((sum, r) => sum + r.hatchingEggs, 0);
  const totalMortality = recentMortality.reduce(
    (sum, r) => sum + r.mortalityMale + r.mortalityFemale + r.spotCullMale + r.spotCullFemale,
    0
  );

  const stats = [
    {
      label: "Active Flocks",
      value: allFlocks.length,
      icon: Bird,
      color: "bg-green-100 text-green-700",
      iconBg: "bg-green-500",
    },
    {
      label: "Active Employees",
      value: activeEmployees.length,
      icon: Users,
      color: "bg-blue-100 text-blue-700",
      iconBg: "bg-blue-500",
    },
    {
      label: "Recent Hatching Eggs",
      value: totalHatchingEggs.toLocaleString(),
      icon: Egg,
      color: "bg-yellow-100 text-yellow-700",
      iconBg: "bg-yellow-500",
    },
    {
      label: "Recent Mortality",
      value: totalMortality.toLocaleString(),
      icon: Skull,
      color: "bg-red-100 text-red-700",
      iconBg: "bg-red-500",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {session?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your farm operations today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Flocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Bird className="w-5 h-5 text-green-600" />
              Active Flocks
            </h2>
            <a href="/dashboard/flock" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View all →
            </a>
          </div>
          {allFlocks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bird className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No active flocks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allFlocks.slice(0, 5).map((flock) => {
                const ageWeeks = calcAgeWeeks(flock.loadingDate);
                return (
                  <div key={flock.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">House {flock.houseNumber}</p>
                      <p className="text-sm text-gray-500">{flock.breed}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-700">{ageWeeks} weeks</p>
                      <p className="text-xs text-gray-400">
                        {(flock.beginningMale + flock.beginningFemale).toLocaleString()} birds
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: "/dashboard/mortality", label: "Record Mortality", icon: "💀", color: "bg-red-50 hover:bg-red-100 text-red-700" },
              { href: "/dashboard/egg-production", label: "Log Egg Production", icon: "🥚", color: "bg-yellow-50 hover:bg-yellow-100 text-yellow-700" },
              { href: "/dashboard/feed", label: "Update Feed", icon: "🌾", color: "bg-amber-50 hover:bg-amber-100 text-amber-700" },
              { href: "/dashboard/flock", label: "Manage Flocks", icon: "🐔", color: "bg-green-50 hover:bg-green-100 text-green-700" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${action.color} border border-transparent hover:border-current/20`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Date */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="w-4 h-4" />
        <span>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
      </div>
    </div>
  );
}
