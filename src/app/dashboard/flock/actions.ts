"use server";

import { db } from "@/db";
import { flocks, flockTransfers, mortalityRecords } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addFlock(formData: FormData) {
  const houseNumber = formData.get("houseNumber") as string;
  const breed = formData.get("breed") as string;
  const loadingDate = formData.get("loadingDate") as string;
  const beginningMale = parseInt(formData.get("beginningMale") as string) || 0;
  const beginningFemale = parseInt(formData.get("beginningFemale") as string) || 0;
  const notes = formData.get("notes") as string;

  if (!houseNumber || !breed || !loadingDate) {
    return { error: "House number, breed, and loading date are required" };
  }

  await db.insert(flocks).values({
    houseNumber,
    breed,
    loadingDate: new Date(loadingDate),
    beginningMale,
    beginningFemale,
    notes: notes || null,
    isActive: true,
  });

  revalidatePath("/dashboard/flock");
  return { success: true, error: null };
}

export async function editFlock(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const houseNumber = formData.get("houseNumber") as string;
  const breed = formData.get("breed") as string;
  const loadingDate = formData.get("loadingDate") as string;
  const beginningMale = parseInt(formData.get("beginningMale") as string) || 0;
  const beginningFemale = parseInt(formData.get("beginningFemale") as string) || 0;
  const notes = formData.get("notes") as string;

  await db.update(flocks).set({
    houseNumber,
    breed,
    loadingDate: new Date(loadingDate),
    beginningMale,
    beginningFemale,
    notes: notes || null,
    updatedAt: new Date(),
  }).where(eq(flocks.id, id));

  revalidatePath("/dashboard/flock");
  return { success: true };
}

export async function deactivateFlock(id: number) {
  await db.update(flocks).set({ isActive: false, updatedAt: new Date() }).where(eq(flocks.id, id));
  revalidatePath("/dashboard/flock");
}

export async function addFlockTransfer(formData: FormData) {
  const session = await getSession();
  const fromFlockId = parseInt(formData.get("fromFlockId") as string);
  const toFlockId = parseInt(formData.get("toFlockId") as string);
  const transferDate = formData.get("transferDate") as string;
  const maleCount = parseInt(formData.get("maleCount") as string) || 0;
  const femaleCount = parseInt(formData.get("femaleCount") as string) || 0;
  const reason = formData.get("reason") as string;

  await db.insert(flockTransfers).values({
    fromFlockId,
    toFlockId,
    transferDate: new Date(transferDate),
    maleCount,
    femaleCount,
    reason: reason || null,
    createdBy: session?.id,
  });

  revalidatePath("/dashboard/flock");
  return { success: true };
}

export async function getFlockStats(flockId: number) {
  const flock = await db.select().from(flocks).where(eq(flocks.id, flockId)).get();
  if (!flock) return null;

  const mortalities = await db.select().from(mortalityRecords).where(eq(mortalityRecords.flockId, flockId));

  const totalMortality = mortalities.reduce(
    (sum, m) => sum + m.mortalityMale + m.mortalityFemale + m.spotCullMale + m.spotCullFemale + m.spentCullMale + m.spentCullFemale + m.missexMale + m.missexFemale,
    0
  );

  const beginningPop = flock.beginningMale + flock.beginningFemale;
  const endingPop = beginningPop - totalMortality;
  const livability = beginningPop > 0 ? ((endingPop / beginningPop) * 100).toFixed(2) : "0.00";
  const depletionRate = beginningPop > 0 ? ((totalMortality / beginningPop) * 100).toFixed(2) : "0.00";

  const loadDate = new Date(flock.loadingDate);
  const ageWeeks = Math.floor((Date.now() - loadDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

  return {
    beginningPop,
    endingPop,
    totalMortality,
    livability,
    depletionRate,
    ageWeeks,
  };
}
