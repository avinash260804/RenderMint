import { NextResponse } from "next/server";

import { requireAuth } from "@/lib/auth/require-auth";
import { handleApiError } from "@/lib/api/handle-error";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  settingsAccountSchema,
  settingsAppearanceSchema,
  settingsConnectionsSchema,
  settingsCreditsSchema,
  settingsDataSchema,
  settingsFeedSchema,
  settingsIdentitySchema,
  settingsNotificationsSchema,
  settingsPrivacySchema,
  settingsProfileSchema,
  settingsSectionSchema,
} from "@/modules/settings/schemas/settings-schema";
import {
  cancelAccountDeletion,
  exportUserData,
  getUserSettings,
  requestAccountDeletion,
  updateAccountSettings,
  updateAppearance,
  updateConnections,
  updateCreativeIdentity,
  updateCreditsSettings,
  updateFeedPreferences,
  updateNotifications,
  updatePrivacy,
  updateProfileSettings,
} from "@/modules/settings/server/settings-service";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    section: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId, email } = await requireAuth();
    const { section: rawSection } = await context.params;
    const section = settingsSectionSchema.parse(rawSection);
    const settings = await getUserSettings(userId);

    if (section === "account") {
      return NextResponse.json({
        data: {
          email,
          ...settings.account,
        },
      });
    }

    if (section === "identity") {
      return NextResponse.json({
        data: settings.identity,
        meta: settings.meta,
      });
    }

    return NextResponse.json({
      data: settings[section],
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { userId } = await requireAuth();
    const { section: rawSection } = await context.params;
    const section = settingsSectionSchema.parse(rawSection);
    const body = await request.json().catch(() => ({}));

    switch (section) {
      case "profile": {
        const input = settingsProfileSchema.parse(body);
        await updateProfileSettings(userId, input);
        break;
      }
      case "identity": {
        const input = settingsIdentitySchema.parse(body);
        await updateCreativeIdentity(userId, input);
        break;
      }
      case "account": {
        const input = settingsAccountSchema.parse(body);
        if (input.password) {
          const supabase = await createServerSupabaseClient();
          const { error } = await supabase.auth.updateUser({ password: input.password });
          if (error) {
            throw new Error(error.message);
          }
        }
        await updateAccountSettings(userId, input);
        break;
      }
      case "notifications": {
        const input = settingsNotificationsSchema.parse(body);
        await updateNotifications(userId, input);
        break;
      }
      case "privacy": {
        const input = settingsPrivacySchema.parse(body);
        await updatePrivacy(userId, input);
        break;
      }
      case "feed": {
        const input = settingsFeedSchema.parse(body);
        await updateFeedPreferences(userId, input);
        break;
      }
      case "appearance": {
        const input = settingsAppearanceSchema.parse(body);
        await updateAppearance(userId, input);
        break;
      }
      case "credits": {
        const input = settingsCreditsSchema.parse(body);
        await updateCreditsSettings(userId, input);
        break;
      }
      case "connections": {
        const input = settingsConnectionsSchema.parse(body);
        await updateConnections(userId, input);
        break;
      }
      case "data": {
        const input = settingsDataSchema.parse(body);
        if (input.requestExport) {
          const file = await exportUserData(userId, input.exportFormat);
          return new NextResponse(file, {
            status: 200,
            headers: {
              "Content-Type":
                input.exportFormat === "csv" ? "text/csv; charset=utf-8" : "application/json; charset=utf-8",
              "Content-Disposition": `attachment; filename=\"atelier-export.${input.exportFormat}\"`,
            },
          });
        }

        if (input.requestAccountDeletion) {
          const result = await requestAccountDeletion(userId);
          return NextResponse.json({ data: result });
        }

        if (input.cancelAccountDeletion) {
          await cancelAccountDeletion(userId);
        }

        break;
      }
    }

    const settings = await getUserSettings(userId);
    if (section === "account") {
      const { email } = await requireAuth();
      return NextResponse.json({ data: { email, ...settings.account } });
    }
    if (section === "identity") {
      return NextResponse.json({ data: settings.identity, meta: settings.meta });
    }
    return NextResponse.json({ data: settings[section] });
  } catch (error) {
    return handleApiError(error);
  }
}
