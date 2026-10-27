import { getSession, SessionPayload } from "@/lib/session";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

/**
 * Memastikan pengguna telah terautentikasi (memiliki sesi aktif yang valid).
 * Lempar AuthenticationError (401) jika sesi tidak ditemukan atau tidak valid.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new AuthenticationError("Sesi Anda telah berakhir atau belum terautentikasi.");
  }
  return session;
}

/**
 * Memastikan pengguna terautentikasi dan memiliki peran (role) tertentu ('pasien' | 'admin').
 * Lempar AuthorizationError (403) jika peran pengguna tidak sesuai.
 */
export async function requireRole(allowedRoles: ("pasien" | "admin")[] | "pasien" | "admin"): Promise<SessionPayload> {
  const session = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(session.role)) {
    throw new AuthorizationError("Anda tidak memiliki akses ke sumber daya ini.");
  }

  return session;
}
