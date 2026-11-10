import type { Metadata } from "next";
import { getContent } from "@/lib/store";
import PartnerExplorer from "@/components/PartnerExplorer";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Partner With Us",
  description: "Partner with Prodathon as a college or a company. Bring the AI hackathon and live workshops to your students, or train your teams and meet early AI talent.",
};

export default async function PartnerPage() {
  const content = await getContent();

  return (
    <>
      <PageHero
        eyebrow="Partner with us"
        title={<>Let&apos;s build the next wave of <span className="text-gradient">AI talent.</span> Together.</>}
        sub="Colleges bring a national AI hackathon and hands-on training to their students. Companies train their teams, back challenges and meet early talent."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#colleges" className="btn-primary py-4 text-base">🎓 I&apos;m a college</a>
          <a href="#companies" className="btn-ghost py-4 text-base">🏢 I&apos;m a company</a>
        </div>
      </PageHero>

      <PartnerExplorer email={content.site.email} partnerColleges={content.colleges.map((c) => c.name)} />
    </>
  );
}
