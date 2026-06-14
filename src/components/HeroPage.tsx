import Link from "next/link";

type Discipline = { id: string; slug: string; name: string };
type Stats = { members: number; posts: number; disciplines: number };

export default function HeroPage({
  disciplines,
  stats,
}: {
  disciplines: Discipline[];
  stats: Stats;
}) {
  return (
    <main>
      <h1>Atelier for design communities</h1>
      <p>Discuss, critique, showcase, and solve with structured design spaces.</p>
      <Link href="/signup">Get Started</Link>
      <section aria-label="Disciplines">
        {disciplines.map((discipline) => (
          <span key={discipline.id}>{discipline.name}</span>
        ))}
      </section>
      <section aria-label="Stats">
        <strong>{stats.members.toLocaleString()}</strong>
        <strong>{stats.posts.toLocaleString()}</strong>
        <strong>{stats.disciplines}</strong>
      </section>
    </main>
  );
}
