"use server";

import { db } from "@/db";
import { eggProduction } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addEggProduction(formData: FormData) {
  const session = await getSession();
  const flockId = parseInt(formData.get("flockId") as string);
  const recordDate = formData.get("recordDate") as string;
  const hatchingEggs = parseInt(formData.get("hatchingEggs") as string) || 0;
  const smallEggs = parseInt(formData.get("smallEggs") as string) || 0;
  const thinShellEggs = parseInt(formData.get("thinShellEggs") as string) || 0;
  const misshapeEggs = parseInt(formData.get("misshapeEggs") as string) || 0;
  const doubleYolkEggs = parseInt(formData.get("doubleYolkEggs") as string) || 0;
  const brokenEggs = parseInt(formData.get("brokenEggs") as string) || 0;
  const spoiledEggs = parseInt(formData.get("spoiledEggs") as string) || 0;
  const othersEggs = parseInt(formData.get("othersEggs") as string) || 0;
  const notes = formData.get("notes") as string;

  if (!flockId || !recordDate) {
    return { error: "Flock and date are required" };
  }

  await db.insert(eggProduction).values({
    flockId,
    recordDate: new Date(recordDate),
    hatchingEggs,
    smallEggs,
    thinShellEggs,
    misshapeEggs,
    doubleYolkEggs,
    brokenEggs,
    spoiledEggs,
    othersEggs,
    reportedBy: session?.id,
    notes: notes || null,
  });

  revalidatePath("/dashboard/egg-production");
  return { success: true };
}
