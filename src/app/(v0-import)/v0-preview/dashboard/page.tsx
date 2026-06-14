import { DashboardPreviewPage } from "@/components/v0/dashboard/dashboard-preview-page";

/*
Sprint 1 gap list: Dashboard
- Replace mock profile identity, discipline switcher, and widgets with /api/profiles/me and feed-service data in Sprint 4.
- Remove notifications patterns and unsupported activity affordances.
- Rewire create, critique, search, and settings CTAs to real application routes.
- Enforce auth-only access before this becomes a live route.
*/
export default function V0DashboardPreviewRoute() {
  return <DashboardPreviewPage />;
}
