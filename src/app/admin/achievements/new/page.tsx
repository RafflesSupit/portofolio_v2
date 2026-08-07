import { AchievementForm } from "../achievement-form";

export default function NewAchievementPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tambah achievement</h1>
      <div className="mt-6">
        <AchievementForm mode="create" />
      </div>
    </div>
  );
}
