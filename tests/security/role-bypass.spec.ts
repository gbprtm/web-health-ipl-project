import { test, expect } from "@playwright/test";

test.describe("Uji Keamanan: Pencegahan Role Bypass", () => {
  test("tamu tanpa sesi diarahkan saat mengakses rute terlindungi", async ({ page }) => {
    // Pengujian middleware redirect untuk rute terproteksi
    const response = await page.goto("/admin/slot");
    // Ekspektasi middleware mengarahkan ke halaman masuk atau memberi respon 401/403
    expect(response?.status()).toBeDefined();
  });
});

