import Link from "next/link";

type Profile = {
  username: string;
  reputation: number;
  discipline?: { name: string };
};

type Post = {
  id: string;
  title: string;
  slug: string;
};

export default function Dashboard({ profile, feed }: { profile: Profile; feed: Post[] }) {
  return (
    <main>
      <h1>Welcome, {profile.username}</h1>
      {profile.discipline ? <p>{profile.discipline.name}</p> : null}
      <p>Reputation {profile.reputation}</p>
      <Link href="/create">New Post</Link>
      <section>
        {feed.length === 0 ? (
          <p>No posts yet. Get started by creating your first post.</p>
        ) : (
          feed.map((post) => (
            <article key={post.id}>
              <h2>{post.title}</h2>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
