"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRole(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string);
  const role = formData.get("role") as "admin" | "manager" | "supervisor" | "worker";

  await db.update(users).set({ role }).where(eq(users.id, userId));
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function toggleUserStatus(formData: FormData) {
  const userId = parseInt(formData.get("userId") as string);
  const isActive = formData.get("isActive") === "true";

  await db.update(users).set({ isActive: !isActive }).where(eq(users.id, userId));
  revalidatePath("/dashboard/settings");
  return { success: true };
}
