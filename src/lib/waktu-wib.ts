/**
 * src/lib/waktu-wib.ts
 * Standarisasi penanganan zona waktu Asia/Jakarta (WIB = UTC+7).
 * Aturan keras no. 7: Seluruh perhitungan tanggal lewat modul ini.
 */

export const TIMEZONE_WIB = "Asia/Jakarta";

/**
 * Mengembalikan objek Date saat ini dalam representasi WIB.
 */
export function nowWib(): Date {
  return new Date();
}

/**
 * Mengonversi tanggal ke format string ISO tanggal (YYYY-MM-DD) berdasarkan zona waktu WIB.
 */
export function toWibDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE_WIB,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

/**
 * Mengonversi tanggal ke representasi string waktu (HH:mm) dalam zona WIB.
 */
export function toWibTimeString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE_WIB,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return formatter.format(date);
}

/**
 * Format tanggal lengkap untuk tampilan pengguna dalam bahasa Indonesia (WIB).
 * Contoh: "29 Oktober 2026, 14:30 WIB"
 */
export function formatWibLengkap(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: TIMEZONE_WIB,
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${formatter.format(date)} WIB`;
}

/**
 * Memeriksa apakah dua tanggal jatuh pada hari yang sama di zona waktu WIB.
 */
export function isSameDayWib(date1: Date, date2: Date): boolean {
  return toWibDateString(date1) === toWibDateString(date2);
}

