import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SpecLabel } from "@/components/ui/spec-label";
import { RegistrationMark } from "@/components/ui/registration-mark";
import { getProfile, getProjectCount } from "@/lib/queries";

export default async function NotFound() {
  const [profile, projectCount] = await Promise.all([getProfile(), getProjectCount()]);

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="relative flex flex-1 items-center px-6 py-28 md:px-8">
        <RegistrationMark position="top-right" className="text-text-3" />
        <RegistrationMark position="bottom-left" className="text-text-3" />
        <div className="mx-auto max-w-[1180px] text-center">
          <SpecLabel className="justify-center">404 · GET</SpecLabel>
          <h1 className="text-display-huge mt-4 text-ink">Route not found.</h1>
          <p className="mt-6 text-body-lg text-text-2">
            This endpoint doesn&apos;t exist — or it&apos;s been deprecated.
          </p>
          <div className="mt-10 flex justify-center">
            <Button href="/">Back home</Button>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
