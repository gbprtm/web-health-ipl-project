import { db } from "@/lib/db";
import { janji, slot } from "@/db/schema/klinik";
import { eq } from "drizzle-orm";

export async function findSlotById(slotId: string) {
  const result = await db.select().from(slot).where(eq(slot.id, slotId)).limit(1);
  return result[0] || null;
}

export async function findJanjiById(janjiId: string) {
  const result = await db.select().from(janji).where(eq(janji.id, janjiId)).limit(1);
  return result[0] || null;
}

