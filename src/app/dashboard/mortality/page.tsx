import { db } from "@/db";
import { mortalityRecords, flocks, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import MortalityClient from "./MortalityClient";
import { Skull } from "lucide-react";

export default async function MortalityPage() {
  const session = await getSession();

  const [records, activeFlocks, allUsers] = await Promise.all([
    db.select().from(mortalityRecords).orderBy(desc(mortalityRecords.recordDate)),
    db.select().from(flocks).where(eq(flocks.isActive, true)),
    db.select().from(users),
  ]);

  const canEdit = session?.role === "admin" || session?.role === "manager" || session?.role === "supervisor" || session?.role === "worker";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Skull className="w-7 h-7 text-red-500" />
          Mortality Management
        </h1>
        <p className="text-gray-500 mt-1">Track daily mortality, culls, and depletion records</p>
      </div>

      <MortalityClient
        records={records}
        flocks={activeFlocks}
        users={allUsers}
        canEdit={canEdit}
        currentUserId={session?.id}
      />
    </div>
  );
}
