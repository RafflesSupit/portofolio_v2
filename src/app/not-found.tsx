import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SpecLabel } from "@/components/ui/spec-label";
import { getProfile, getProjectCount } from "@/lib/queries";

export default async function NotFound() {
  const [profile, projectCount] = await Promise.all([getProfile(), getProjectCount()]);

  return (
    <>
      <Nav profile={profile} projectCount={projectCount} />
      <main id="main-content" className="flex flex-1 items-center px-6 py-28 md:px-8">
        <div className="mx-auto max-w-[1180px] text-center">
          <SpecLabel className="justify-center">404</SpecLabel>
          <h1 className="text-display-huge mt-4 text-ink">Not found.</h1>
          <p className="mt-6 text-body-lg text-text-2">This page doesn&apos;t exist — or it moved.</p>
          <div className="mt-10 flex justify-center">
            <Button href="/">Back home</Button>
          </div>
        </div>
      </main>
      <Footer profile={profile} />
    </>
  );
}
