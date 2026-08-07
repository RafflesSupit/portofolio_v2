import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tambah project</h1>
      <div className="mt-6">
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
