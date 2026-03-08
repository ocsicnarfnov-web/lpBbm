"use server";

import { db } from "@/db";
import { mortalityRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addMortality(formData: FormData) {
  const session = await getSession();
  const flockId = parseInt(formData.get("flockId") as string);
  const recordDate = formData.get("recordDate") as string;
  const mortalityMale = parseInt(formData.get("mortalityMale") as string) || 0;
  const mortalityFemale = parseInt(formData.get("mortalityFemale") as string) || 0;
  const spotCullMale = parseInt(formData.get("spotCullMale") as string) || 0;
  const spotCullFemale = parseInt(formData.get("spotCullFemale") as string) || 0;
  const spentCullMale = parseInt(formData.get("spentCullMale") as string) || 0;
  const spentCullFemale = parseInt(formData.get("spentCullFemale") as string) || 0;
  const missexMale = parseInt(formData.get("missexMale") as string) || 0;
  const missexFemale = parseInt(formData.get("missexFemale") as string) || 0;
  const notes = formData.get("notes") as string;

  if (!flockId || !recordDate) {
    return { error: "Flock and date are required" };
  }

  await db.insert(mortalityRecords).values({
    flockId,
    recordDate: new Date(recordDate),
    mortalityMale,
    mortalityFemale,
    spotCullMale,
    spotCullFemale,
    spentCullMale,
    spentCullFemale,
    missexMale,
    missexFemale,
    reportedBy: session?.id,
    notes: notes || null,
  });

  revalidatePath("/dashboard/mortality");
  return { success: true };
}

export async function deleteMortality(id: number) {
  await db.delete(mortalityRecords).where(eq(mortalityRecords.id, id));
  revalidatePath("/dashboard/mortality");
}
