import { z } from "zod";

export const buatJanjiSchema = z.object({
  dokterId: z.string().uuid("ID dokter harus berformat UUID yang valid"),
  slotId: z.string().uuid("ID slot harus berformat UUID yang valid"),
  keluhan: z.string().max(1000, "Keluhan maksimal 1000 karakter").optional(),
});

export const batalkanJanjiSchema = z.object({
  janjiId: z.string().uuid("ID janji harus berformat UUID yang valid"),
  alasanBatal: z.string().min(5, "Alasan pembatalan minimal 5 karakter"),
});

export type BuatJanjiInput = z.infer<typeof buatJanjiSchema>;
export type BatalkanJanjiInput = z.infer<typeof batalkanJanjiSchema>;

