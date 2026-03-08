import { db } from "@/db";
import { flocks, mortalityRecords, flockTransfers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import FlockClient from "./FlockClient";
import { Bird } from "lucide-react";

function calcAgeWeeks(loadingDate: Date): number {
  const now = new Date();
  const loadDate = new Date(loadingDate);
  return Math.floor((now.getTime() - loadDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export default async function FlockPage() {
  const session = await getSession();

  const allFlocks = await db.select().from(flocks).orderBy(desc(flocks.createdAt));
  const allMortalities = await db.select().from(mortalityRecords);
  const allTransfers = await db.select().from(flockTransfers).orderBy(desc(flockTransfers.transferDate));

  // Calculate stats for each flock
  const flocksWithStats = allFlocks.map((flock) => {
    const mortalities = allMortalities.filter((m) => m.flockId === flock.id);
    const totalMortality = mortalities.reduce(
      (sum, m) =>
        sum +
        m.mortalityMale +
        m.mortalityFemale +
        m.spotCullMale +
        m.spotCullFemale +
        m.spentCullMale +
        m.spentCullFemale +
        m.missexMale +
        m.missexFemale,
      0
    );

    const beginningPop = flock.beginningMale + flock.beginningFemale;
    const endingPop = Math.max(0, beginningPop - totalMortality);
    const livability = beginningPop > 0 ? ((endingPop / beginningPop) * 100).toFixed(2) : "0.00";
    const depletionRate = beginningPop > 0 ? ((totalMortality / beginningPop) * 100).toFixed(2) : "0.00";
    const ageWeeks = calcAgeWeeks(flock.loadingDate);

    return {
      ...flock,
      beginningPop,
      endingPop,
      totalMortality,
      livability,
      depletionRate,
      ageWeeks,
    };
  });

  const canEdit = session?.role === "admin" || session?.role === "manager" || session?.role === "supervisor";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bird className="w-7 h-7 text-green-600" />
          Flock Management
        </h1>
        <p className="text-gray-500 mt-1">Manage your broiler breeder flocks</p>
      </div>

      <FlockClient
        flocks={flocksWithStats}
        transfers={allTransfers}
        canEdit={canEdit}
      />
    </div>
  );
}
