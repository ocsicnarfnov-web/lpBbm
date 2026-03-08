"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function recoverAccountAction(formData: FormData) {
  const email = formData.get("email") as string;
  const recoveryCode = formData.get("recoveryCode") as string;

  // Secret recovery code - in production this should be environment variable
  const SECRET_CODE = "RECOVER-2024";

  if (recoveryCode !== SECRET_CODE) {
    return { error: "Invalid recovery code. Contact admin." };
  }

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    return { error: "User not found with this email." };
  }

  // Reactivate the user
  await db.update(users).set({ isActive: true }).where(eq(users.id, user.id));

  return { success: true };
}
