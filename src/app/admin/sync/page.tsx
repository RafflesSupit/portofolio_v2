import { SyncButton } from "./sync-button";

export default function AdminSyncPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Sinkronisasi</h1>
      <p className="mt-2 max-w-2xl text-body-sm text-text-2">
        Data (profil, skill, project, pengalaman, achievement, FAQ, dan blog) otomatis tersalin ke
        penyimpanan cadangan setiap kali kamu simpan perubahan — tombol di bawah ini untuk
        memastikan semuanya cocok secara manual, misalnya setelah pertama kali menyiapkan
        penyimpanan cadangan, atau kalau kamu curiga ada yang tidak tersinkron.
      </p>

      <div className="mt-6">
        <SyncButton />
      </div>
    </div>
  );
}
