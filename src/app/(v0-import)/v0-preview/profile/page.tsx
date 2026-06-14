import { ProfilePreviewPage } from "@/components/v0/profile/profile-preview-page";

/*
Sprint 1 gap list: Profile
- Replace PROFILE mock data with /api/profiles/[username] and /api/profiles/me in Sprint 5.
- Remove follower/chat style actions because they are out of scope for the MVP.
- Expand the public profile to show real skills, software, reputation, and showcase history.
- Add owner editing flows without changing the public route contract.
*/
export default function V0ProfilePreviewRoute() {
  return <ProfilePreviewPage />;
}
