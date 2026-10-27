export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50 text-slate-900">
      <div className="max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Aplikasi Pengelola Kesehatan Personal
        </h1>
        <p className="text-slate-600">
          Sistem manajemen jadwal kontrol, janji spesialis, antrian klinik, dan catatan kesehatan harian.
        </p>
      </div>
    </main>
  );
}
