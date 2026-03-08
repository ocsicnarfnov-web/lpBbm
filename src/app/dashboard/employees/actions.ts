"use server";

import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateEmployeeId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `EMP-${year}-${random}`;
}

export async function addEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const birthday = formData.get("birthday") as string;
  const address = formData.get("address") as string;
  const contactNumber = formData.get("contactNumber") as string;
  const email = formData.get("email") as string;
  const dateHired = formData.get("dateHired") as string;
  const position = formData.get("position") as string;
  const pictureUrl = formData.get("pictureUrl") as string;

  if (!firstName || !lastName || !dateHired || !position) {
    return { error: "First name, last name, date hired, and position are required" };
  }

  const employeeId = generateEmployeeId();

  await db.insert(employees).values({
    employeeId,
    firstName,
    lastName,
    birthday: birthday ? new Date(birthday) : null,
    address: address || null,
    contactNumber: contactNumber || null,
    email: email || null,
    dateHired: new Date(dateHired),
    position,
    status: "active",
    pictureUrl: pictureUrl || null,
  });

  revalidatePath("/dashboard/employees");
  return { success: true };
}

export async function editEmployee(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const birthday = formData.get("birthday") as string;
  const address = formData.get("address") as string;
  const contactNumber = formData.get("contactNumber") as string;
  const email = formData.get("email") as string;
  const dateHired = formData.get("dateHired") as string;
  const position = formData.get("position") as string;
  const resignationDate = formData.get("resignationDate") as string;
  const status = formData.get("status") as "active" | "resigned" | "terminated";
  const pictureUrl = formData.get("pictureUrl") as string;

  await db.update(employees).set({
    firstName,
    lastName,
    birthday: birthday ? new Date(birthday) : null,
    address: address || null,
    contactNumber: contactNumber || null,
    email: email || null,
    dateHired: new Date(dateHired),
    position,
    resignationDate: resignationDate ? new Date(resignationDate) : null,
    status,
    pictureUrl: pictureUrl || null,
    updatedAt: new Date(),
  }).where(eq(employees.id, id));

  revalidatePath("/dashboard/employees");
  return { success: true };
}
