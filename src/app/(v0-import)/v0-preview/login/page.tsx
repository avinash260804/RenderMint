import { LoginPreviewPage } from "@/components/v0/login/login-preview-page";

/*
Sprint 1 gap list: Login
- Replace placeholder form handling with Supabase Google OAuth and magic-link flows in Sprint 2.
- Remove unsupported Facebook and LinkedIn provider affordances.
- Map validation and auth errors into the imported visual states.
- Preserve onboarding redirect rules for new users and returning users.
*/
export default function V0LoginPreviewRoute() {
  return <LoginPreviewPage />;
}
