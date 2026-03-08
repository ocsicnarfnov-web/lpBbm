import { db } from "@/db";
import { eggProduction, flocks, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import EggProductionClient from "./EggProductionClient";
import { Egg } from "lucide-react";

export default async function EggProductionPage() {
  const session = await getSession();

  const [records, activeFlocks, allUsers] = await Promise.all([
    db.select().from(eggProduction).orderBy(desc(eggProduction.recordDate)),
    db.select().from(flocks).where(eq(flocks.isActive, true)),
    db.select().from(users),
  ]);

  const canEdit = true; // All authenticated users can log egg production

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Egg className="w-7 h-7 text-yellow-500" />
          Egg Production Management
        </h1>
        <p className="text-gray-500 mt-1">Track daily egg production by house</p>
      </div>

      <EggProductionClient
        records={records}
        flocks={activeFlocks}
        users={allUsers}
        canEdit={canEdit}
      />
    </div>
  );
}
