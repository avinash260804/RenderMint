"use client";

import { useState } from "react";

export default function LoginForm({
  onSubmit,
}: {
  onSubmit: (input: { email: string; password: string }) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Invalid email" : "";
  const passwordError = !password ? "Password is required" : "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (emailError || passwordError) return;
    await onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      {submitted && emailError ? <p>{emailError}</p> : null}
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      {submitted && passwordError ? <p>{passwordError}</p> : null}
      <button type="submit">Log in</button>
    </form>
  );
}
