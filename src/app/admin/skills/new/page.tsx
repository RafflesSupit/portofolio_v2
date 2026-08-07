import { SkillForm } from "../skill-form";

export default function NewSkillCategoryPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tambah kategori skill</h1>
      <div className="mt-6">
        <SkillForm mode="create" />
      </div>
    </div>
  );
}
