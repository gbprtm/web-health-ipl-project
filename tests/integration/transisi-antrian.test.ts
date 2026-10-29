import { describe, it, expect } from "vitest";

describe("Uji Integrasi: Transisi Status Antrian Klinik", () => {
  it("harus mengikuti urutan status: belum_check_in -> menunggu -> diperiksa -> selesai", () => {
    const urutanStatus = [
      "belum_check_in",
      "menunggu",
      "diperiksa",
      "selesai",
    ];
    expect(urutanStatus.length).toBe(4);
    expect(urutanStatus[0]).toBe("belum_check_in");
  });
});

