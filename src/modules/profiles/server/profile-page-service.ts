import { getDisciplinesWithSoftwares } from "@/modules/auth/server/onboarding-service";
import {
  getProfileById,
  getProfileByUsername,
  getProfilePosts,
} from "@/modules/profiles/server/profile-service";

export async function getPublicProfilePageData(username: string) {
  const profile = await getProfileByUsername(username);
  const posts = await getProfilePosts(profile.id);

  return {
    profile,
    showcasePosts: posts.filter((post) => post.type === "showcase"),
    recentPosts: posts,
    contributionBreakdown: {
      discussions: posts.filter((post) => post.type === "discussion").length,
      critiques: posts.filter((post) => post.type === "critique").length,
      showcases: posts.filter((post) => post.type === "showcase").length,
      help: posts.filter((post) => post.type === "help").length,
      resources: posts.filter((post) => post.type === "resource").length,
    },
  };
}

export async function getEditableProfilePageData(userId: string) {
  const [profile, posts, disciplines] = await Promise.all([
    getProfileById(userId),
    getProfilePosts(userId),
    getDisciplinesWithSoftwares(),
  ]);

  return {
    profile,
    showcasePosts: posts.filter((post) => post.type === "showcase"),
    recentPosts: posts,
    disciplines,
  };
}

