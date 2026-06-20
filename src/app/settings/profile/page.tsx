"use client";

import { SaveBar } from "@/components/settings/SaveBar";
import { SettingsInput } from "@/components/settings/SettingsInput";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { ToggleRow } from "@/components/settings/ToggleRow";
import { Textarea } from "@/components/ui/textarea";
import { useSettingsSection } from "@/app/settings/_components/use-settings-section";
import type { SettingsProfileForm } from "@/app/settings/_components/settings-types";

const EMPTY_PROFILE: SettingsProfileForm = {
  displayName: "",
  username: "",
  bio: "",
  avatarUrl: "",
  coverImageUrl: "",
  portfolioUrl: "",
  location: "",
  locationVisible: true,
  socialLinks: {
    twitter: "",
    instagram: "",
    behance: "",
    linkedin: "",
    dribbble: "",
  },
};

export default function SettingsProfilePage() {
  const { loading, saving, formData, setFormData, isDirty, save, discard } = useSettingsSection({
    section: "profile",
    fallbackData: EMPTY_PROFILE,
    successMessage: "Profile settings updated.",
  });

  function update<K extends keyof SettingsProfileForm>(key: K, value: SettingsProfileForm[K]) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function updateSocialLink(key: keyof SettingsProfileForm["socialLinks"], value: string) {
    setFormData((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [key]: value,
      },
    }));
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile settings...</p>;
  }

  return (
    <>
      <SettingsSection
        title="Profile"
        description="Manage the public profile information that appears across the Atelier community."
      >
        <SettingsRow label="Display Name" description="Your full or preferred public name.">
          <SettingsInput
            id="display-name"
            value={formData.displayName}
            maxLength={80}
            counter={{ current: formData.displayName.length, max: 80 }}
            onChange={(event) => update("displayName", event.target.value)}
          />
        </SettingsRow>

        <SettingsRow label="Username" description="Your unique public handle.">
          <SettingsInput
            id="username"
            value={formData.username}
            maxLength={32}
            helper="Lowercase letters, numbers, and underscore only."
            onChange={(event) => update("username", event.target.value.toLowerCase())}
          />
        </SettingsRow>

        <SettingsRow label="Bio" description="Briefly describe your design practice.">
          <Textarea
            id="bio"
            value={formData.bio}
            maxLength={300}
            rows={5}
            className="min-h-[140px] rounded-xl"
            onChange={(event) => update("bio", event.target.value)}
          />
          <p className="mt-2 text-xs text-muted-foreground">{formData.bio.length} / 300</p>
        </SettingsRow>

        <SettingsRow label="Avatar URL" description="Optional direct link to your avatar image.">
          <SettingsInput
            id="avatar-url"
            type="url"
            value={formData.avatarUrl}
            placeholder="https://..."
            onChange={(event) => update("avatarUrl", event.target.value)}
          />
        </SettingsRow>

        <SettingsRow label="Cover Image URL" description="Optional header image for richer profile presentation.">
          <SettingsInput
            id="cover-image-url"
            type="url"
            value={formData.coverImageUrl}
            placeholder="https://..."
            onChange={(event) => update("coverImageUrl", event.target.value)}
          />
        </SettingsRow>

        <SettingsRow label="Portfolio URL" description="Link to your main public portfolio.">
          <SettingsInput
            id="portfolio-url"
            type="url"
            value={formData.portfolioUrl}
            placeholder="https://yourportfolio.com"
            onChange={(event) => update("portfolioUrl", event.target.value)}
          />
        </SettingsRow>

        <SettingsRow label="Location" description="Optional city or region shown on your profile.">
          <SettingsInput
            id="location"
            value={formData.location}
            maxLength={120}
            onChange={(event) => update("location", event.target.value)}
          />
        </SettingsRow>

        <ToggleRow
          label="Show location"
          description="Display your location on your public profile."
          checked={formData.locationVisible}
          onChange={(checked) => update("locationVisible", checked)}
        />
      </SettingsSection>

      <SettingsSection title="Social Links" description="Connect your external creative identities.">
        <SettingsRow label="Twitter / X">
          <SettingsInput
            id="social-twitter"
            value={formData.socialLinks.twitter ?? ""}
            onChange={(event) => updateSocialLink("twitter", event.target.value)}
          />
        </SettingsRow>
        <SettingsRow label="Instagram">
          <SettingsInput
            id="social-instagram"
            value={formData.socialLinks.instagram ?? ""}
            onChange={(event) => updateSocialLink("instagram", event.target.value)}
          />
        </SettingsRow>
        <SettingsRow label="Behance">
          <SettingsInput
            id="social-behance"
            value={formData.socialLinks.behance ?? ""}
            onChange={(event) => updateSocialLink("behance", event.target.value)}
          />
        </SettingsRow>
        <SettingsRow label="LinkedIn">
          <SettingsInput
            id="social-linkedin"
            value={formData.socialLinks.linkedin ?? ""}
            onChange={(event) => updateSocialLink("linkedin", event.target.value)}
          />
        </SettingsRow>
        <SettingsRow label="Dribbble">
          <SettingsInput
            id="social-dribbble"
            value={formData.socialLinks.dribbble ?? ""}
            onChange={(event) => updateSocialLink("dribbble", event.target.value)}
          />
        </SettingsRow>
      </SettingsSection>

      <SaveBar isDirty={isDirty} isSaving={saving} onSave={save} onDiscard={discard} />
    </>
  );
}
