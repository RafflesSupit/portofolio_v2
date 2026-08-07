import { ExperienceForm } from "../experience-form";

export default function NewExperiencePage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tambah experience</h1>
      <div className="mt-6">
        <ExperienceForm mode="create" />
      </div>
    </div>
  );
}
