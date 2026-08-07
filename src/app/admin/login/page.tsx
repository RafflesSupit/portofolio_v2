import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-h2 text-ink">Admin Login</h1>
      <p className="mt-2 text-body-sm text-text-2">Masuk untuk mengelola isi situs.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
