"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { AppUser, Asset, AssetFormInput } from "@/lib/types/database";

export async function getAssets(): Promise<{
  data: Asset[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("asset")
    .select(
      "asset_id, asset_type, status, purchase_date, assigned_user_id, assigned_user:assigned_user_id(full_name)"
    )
    .order("asset_id");

  if (error) return { data: [], error: error.message };
  return { data: (data as unknown as Asset[]) ?? [], error: null };
}

export async function getAssignableUsers(): Promise<{
  data: Pick<AppUser, "user_id" | "full_name">[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user")
    .select("user_id, full_name")
    .order("full_name");

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function createAsset(input: AssetFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("asset").insert(input);

  if (error) return { error: error.message };
  revalidatePath("/assets");
  revalidatePath("/dashboard");
  revalidatePath("/service-requests");
  return { error: null };
}

export async function updateAsset(assetId: number, input: AssetFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("asset").update(input).eq("asset_id", assetId);

  if (error) return { error: error.message };
  revalidatePath("/assets");
  revalidatePath("/dashboard");
  revalidatePath("/service-requests");
  return { error: null };
}

export async function deleteAsset(assetId: number) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("asset").delete().eq("asset_id", assetId);

  if (error) return { error: error.message };
  revalidatePath("/assets");
  revalidatePath("/dashboard");
  revalidatePath("/service-requests");
  return { error: null };
}
