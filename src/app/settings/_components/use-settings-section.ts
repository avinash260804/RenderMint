"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "@/lib/toast";
import type { SettingsSection } from "@/modules/settings/schemas/settings-schema";

type SettingsHookOptions<TData, TMeta> = {
  section: SettingsSection;
  fallbackData: TData;
  fallbackMeta?: TMeta;
  successMessage: string;
};

export function useSettingsSection<TData, TMeta = undefined>({
  section,
  fallbackData,
  fallbackMeta,
  successMessage,
}: SettingsHookOptions<TData, TMeta>) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TData>(fallbackData);
  const [initialState, setInitialState] = useState<TData>(fallbackData);
  const [meta, setMeta] = useState<TMeta | undefined>(fallbackMeta);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialState),
    [formData, initialState],
  );

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/settings/${section}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load settings.");
      }

      const payload = (await response.json()) as { data: TData; meta?: TMeta };
      setFormData(payload.data);
      setInitialState(payload.data);
      setMeta(payload.meta);
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Unable to load settings.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast, section]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/settings/${section}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(payload?.error?.message ?? "Unable to save settings.");
      }

      const payload = (await response.json().catch(() => null)) as { data?: TData; meta?: TMeta } | null;
      const nextData = payload?.data ?? formData;
      setFormData(nextData);
      setInitialState(nextData);
      if (payload?.meta !== undefined) {
        setMeta(payload.meta);
      }
      addToast(successMessage, "success");
    } catch (error) {
      addToast(error instanceof Error ? error.message : "Unable to save settings.", "error");
    } finally {
      setSaving(false);
    }
  }, [addToast, formData, section, successMessage]);

  const discard = useCallback(() => {
    setFormData(initialState);
  }, [initialState]);

  return {
    loading,
    saving,
    formData,
    setFormData,
    initialState,
    meta,
    isDirty,
    save,
    discard,
    reload,
  };
}
