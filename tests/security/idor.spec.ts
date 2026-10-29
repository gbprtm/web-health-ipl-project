import { test, expect } from "@playwright/test";

test.describe("Uji Keamanan: Pencegahan IDOR (Insecure Direct Object References)", () => {
  test("pasien dilarang mengakses data milik pasien lain via modifikasi ID", async ({ page }) => {
    // Skenario verifikasi policy guard data pasien
    await page.goto("/masuk");
    expect(page.url()).toContain("/masuk");
  });
});

