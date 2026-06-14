type Profile = {
  username: string;
  bio?: string;
  reputation: number;
  discipline?: { name: string };
  skills?: string[];
  softwares?: string[];
};

export default function ProfilePage({ profile }: { profile: Profile }) {
  return (
    <main>
      <h1>{profile.username}</h1>
      {profile.bio ? <p>{profile.bio}</p> : null}
      {profile.discipline ? <strong>{profile.discipline.name}</strong> : null}
      <p>Reputation {profile.reputation}</p>
      <section>
        {(profile.skills ?? []).map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </section>
      <section>
        {(profile.softwares ?? []).map((software) => (
          <span key={software}>{software}</span>
        ))}
      </section>
    </main>
  );
}
