"use server";

import { db } from "@/db";
import { feedCategories, feedInventory, feedIncoming, feedConsumption } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addFeedCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Category name is required" };

  const category = await db.insert(feedCategories).values({
    name,
    description: description || null,
  }).returning().get();

  // Create inventory record for this category
  await db.insert(feedInventory).values({
    categoryId: category.id,
    beginningInventoryKg: 0,
    currentStockKg: 0,
  });

  revalidatePath("/dashboard/feed");
  return { success: true };
}

export async function editFeedCategory(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await db.update(feedCategories).set({
    name,
    description: description || null,
  }).where(eq(feedCategories.id, id));

  revalidatePath("/dashboard/feed");
  return { success: true };
}

export async function setBeginningInventory(formData: FormData) {
  const categoryId = parseInt(formData.get("categoryId") as string);
  const beginningKg = parseFloat(formData.get("beginningKg") as string) || 0;

  const existing = await db.select().from(feedInventory).where(eq(feedInventory.categoryId, categoryId)).get();

  if (existing) {
    await db.update(feedInventory).set({
      beginningInventoryKg: beginningKg,
      currentStockKg: beginningKg,
      updatedAt: new Date(),
    }).where(eq(feedInventory.categoryId, categoryId));
  } else {
    await db.insert(feedInventory).values({
      categoryId,
      beginningInventoryKg: beginningKg,
      currentStockKg: beginningKg,
    });
  }

  revalidatePath("/dashboard/feed");
  return { success: true };
}

export async function addFeedIncoming(formData: FormData) {
  const session = await getSession();
  const categoryId = parseInt(formData.get("categoryId") as string);
  const quantityBags = parseFloat(formData.get("quantityBags") as string) || 0;
  const deliveryDate = formData.get("deliveryDate") as string;
  const supplier = formData.get("supplier") as string;
  const notes = formData.get("notes") as string;

  const quantityKg = quantityBags * 50; // 1 bag = 50 kg

  await db.insert(feedIncoming).values({
    categoryId,
    quantityBags,
    quantityKg,
    deliveryDate: new Date(deliveryDate),
    supplier: supplier || null,
    notes: notes || null,
    createdBy: session?.id,
  });

  // Update current stock
  const inventory = await db.select().from(feedInventory).where(eq(feedInventory.categoryId, categoryId)).get();
  if (inventory) {
    await db.update(feedInventory).set({
      currentStockKg: inventory.currentStockKg + quantityKg,
      updatedAt: new Date(),
    }).where(eq(feedInventory.categoryId, categoryId));
  }

  revalidatePath("/dashboard/feed");
  return { success: true };
}

export async function addFeedConsumption(formData: FormData) {
  const session = await getSession();
  const flockId = parseInt(formData.get("flockId") as string);
  const categoryId = parseInt(formData.get("categoryId") as string);
  const consumptionDate = formData.get("consumptionDate") as string;
  const quantityKg = parseFloat(formData.get("quantityKg") as string) || 0;
  const notes = formData.get("notes") as string;

  await db.insert(feedConsumption).values({
    flockId,
    categoryId,
    consumptionDate: new Date(consumptionDate),
    quantityKg,
    notes: notes || null,
    createdBy: session?.id,
  });

  // Update current stock
  const inventory = await db.select().from(feedInventory).where(eq(feedInventory.categoryId, categoryId)).get();
  if (inventory) {
    await db.update(feedInventory).set({
      currentStockKg: Math.max(0, inventory.currentStockKg - quantityKg),
      updatedAt: new Date(),
    }).where(eq(feedInventory.categoryId, categoryId));
  }

  revalidatePath("/dashboard/feed");
  return { success: true };
}
