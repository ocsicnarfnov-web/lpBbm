"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { setSession, clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const user = await db.select().from(users).where(eq(users.email, email)).get();

  if (!user) {
    return { error: "Invalid email or password" };
  }

  if (!user.isActive) {
    return { error: "Your account has been deactivated. Contact admin." };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "Invalid email or password" };
  }

  await setSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "admin" | "manager" | "supervisor" | "worker",
  });

  redirect("/dashboard");
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
  if (existingUser) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if this is the first user - make them admin
  const allUsers = await db.select().from(users);
  const role = allUsers.length === 0 ? "admin" : "worker";

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    role,
    isActive: true,
  });

  return { success: "Registration successful! Please login." };
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
