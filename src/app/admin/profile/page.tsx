import { getProfile } from "@/lib/queries";
import { ProfileForm } from "./profile-form";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div>
      <h1 className="text-h2 text-ink">Profile</h1>
      <p className="mt-2 text-body-sm text-text-2">Info utama, bio, kontak, dan quick facts.</p>
      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
