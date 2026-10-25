export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pengelola Layanan Kesehatan Personal
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400">
          Sistem manajemen jadwal kontrol, slot dokter, dan nomor antrian klinik.
        </p>
      </div>
    </main>
  );
}
