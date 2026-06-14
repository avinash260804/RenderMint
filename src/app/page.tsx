import { LandingPage } from "@/components/v0/hero/landing-page";
import { getPlatformStats } from "@/modules/stats/server/stats-service";

export const revalidate = 300;

export default async function HomePage() {
  const stats = await getPlatformStats();

  return (
    <LandingPage
      disciplines={stats.disciplineBreakdown}
      stats={{
        members: stats.members,
        posts: stats.posts,
        disciplines: stats.disciplines,
      }}
    />
  );
}
