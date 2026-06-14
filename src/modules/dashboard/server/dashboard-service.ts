import { getDisciplineFeed, getDisciplineList } from "@/modules/feed/server/feed-service";
import { getProfileById } from "@/modules/profiles/server/profile-service";

export async function getDashboardState(userId: string, requestedDiscipline?: string) {
  const [profile, disciplines] = await Promise.all([getProfileById(userId), getDisciplineList()]);

  const availableSlugs = new Set<string>(disciplines.map((discipline) => discipline.slug));
  const defaultDisciplineSlug = profile.primaryDiscipline ?? disciplines[0]?.slug ?? null;
  const activeDisciplineSlug =
    requestedDiscipline && availableSlugs.has(requestedDiscipline)
      ? requestedDiscipline
      : defaultDisciplineSlug;

  const feed = activeDisciplineSlug
    ? await getDisciplineFeed(activeDisciplineSlug)
    : { discipline: null, posts: [] };

  const sections = {
    critiques: feed.posts.filter((post) => post.type === "critique"),
    discussions: feed.posts.filter((post) => post.type === "discussion"),
    showcases: feed.posts.filter((post) => post.type === "showcase"),
    help: feed.posts.filter((post) => post.type === "help"),
    resources: feed.posts.filter((post) => post.type === "resource"),
  };

  return {
    profile,
    disciplines,
    activeDiscipline: feed.discipline,
    activeDisciplineSlug,
    sections,
    totalPosts: feed.posts.length,
  };
}
