import { BuatJanjiInput } from "./janji.schema";
import { UserSessionPayload, canCreateAppointment } from "./janji.policy";
import { findSlotById } from "./janji.repository";

export async function createAppointmentService(
  user: UserSessionPayload,
  data: BuatJanjiInput
) {
  if (!canCreateAppointment(user)) {
    throw new Error("Hanya pasien yang dapat melakukan reservasi janji temu");
  }

  const slotData = await findSlotById(data.slotId);
  if (!slotData || !slotData.tersedia) {
    throw new Error("Slot waktu dokter tidak tersedia atau sudah penuh");
  }

  return { success: true, slotId: data.slotId, pasienId: user.userId };
}

