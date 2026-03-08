import { db } from "@/db";
import { feedCategories, feedInventory, feedIncoming, feedConsumption, flocks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth";
import FeedClient from "./FeedClient";
import { Wheat } from "lucide-react";

export default async function FeedPage() {
  const session = await getSession();

  const [categories, inventories, incoming, consumption, activeFlocks] = await Promise.all([
    db.select().from(feedCategories),
    db.select().from(feedInventory),
    db.select().from(feedIncoming).orderBy(desc(feedIncoming.deliveryDate)),
    db.select().from(feedConsumption).orderBy(desc(feedConsumption.consumptionDate)),
    db.select().from(flocks).where(eq(flocks.isActive, true)),
  ]);

  // Merge categories with inventory
  const categoriesWithInventory = categories.map((cat) => {
    const inv = inventories.find((i) => i.categoryId === cat.id);
    const totalIncoming = incoming
      .filter((i) => i.categoryId === cat.id)
      .reduce((sum, i) => sum + i.quantityKg, 0);
    const totalConsumed = consumption
      .filter((c) => c.categoryId === cat.id)
      .reduce((sum, c) => sum + c.quantityKg, 0);

    return {
      ...cat,
      beginningInventoryKg: inv?.beginningInventoryKg || 0,
      currentStockKg: inv?.currentStockKg || 0,
      totalIncomingKg: totalIncoming,
      totalConsumedKg: totalConsumed,
      endingInventoryKg: (inv?.beginningInventoryKg || 0) + totalIncoming - totalConsumed,
    };
  });

  const canEdit = session?.role === "admin" || session?.role === "manager" || session?.role === "supervisor";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wheat className="w-7 h-7 text-green-600" />
          Feed Management
        </h1>
        <p className="text-gray-500 mt-1">Track feed inventory and consumption</p>
      </div>

      <FeedClient
        categories={categoriesWithInventory}
        incoming={incoming}
        consumption={consumption}
        flocks={activeFlocks}
        canEdit={canEdit}
      />
    </div>
  );
}
