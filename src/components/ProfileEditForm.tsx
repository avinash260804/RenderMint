"use client";

import { useState } from "react";

type ProfileEditFormProps = {
  initialValues: {
    username: string;
    bio: string;
  };
  onSubmit: (input: { username: string; bio: string }) => Promise<void>;
};

export default function ProfileEditForm({ initialValues, onSubmit }: ProfileEditFormProps) {
  const [username, setUsername] = useState(initialValues.username);
  const [bio, setBio] = useState(initialValues.bio);
  const [submitted, setSubmitted] = useState(false);

  const bioError = bio.length > 500 ? "Bio is too long. Maximum 500 characters." : "";
  const usernameError = /\s/.test(username) ? "Invalid username format. No spaces allowed." : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (bioError || usernameError) return;
    await onSubmit({ username, bio });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input value={username} onChange={(event) => setUsername(event.target.value)} />
      </label>
      {submitted && usernameError ? <p>{usernameError}</p> : null}
      <label>
        Bio
        <textarea value={bio} onChange={(event) => setBio(event.target.value)} />
      </label>
      {submitted && bioError ? <p>{bioError}</p> : null}
      <button type="submit">Save</button>
    </form>
  );
}
