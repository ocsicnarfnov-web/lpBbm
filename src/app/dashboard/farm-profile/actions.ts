"use server";

import { db } from "@/db";
import { farmProfile } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function saveFarmProfile(formData: FormData) {
  const farmName = formData.get("farmName") as string;
  const farmAddress = formData.get("farmAddress") as string;
  const logoUrl = formData.get("logoUrl") as string;

  if (!farmName || !farmAddress) {
    return { error: "Farm name and address are required" };
  }

  const existing = await db.select().from(farmProfile).get();

  if (existing) {
    await db.update(farmProfile).set({
      farmName,
      farmAddress,
      logoUrl: logoUrl || null,
      updatedAt: new Date(),
    });
  } else {
    await db.insert(farmProfile).values({
      farmName,
      farmAddress,
      logoUrl: logoUrl || null,
    });
  }

  revalidatePath("/dashboard/farm-profile");
  return { success: true };
}
