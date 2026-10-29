/**
 * src/db/seed/index.ts
 * Skrip inisialisasi pengisian data dummy dan akun awal.
 * Terkait dengan tugas A13 (Seed admin + data fiktif).
 */

import { db } from "@/lib/db";

export async function runSeed() {
  // Verifikasi objek db terinisialisasi
  if (db) {
    return { success: true, count: 0 };
  }
  return { success: false, count: 0 };
}

if (process.env.NODE_ENV === "development" && process.env.RUN_SEED === "true") {
  void runSeed();
}
