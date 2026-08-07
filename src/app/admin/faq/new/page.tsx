import { FaqForm } from "../faq-form";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-h2 text-ink">Tambah FAQ</h1>
      <div className="mt-6">
        <FaqForm mode="create" />
      </div>
    </div>
  );
}
