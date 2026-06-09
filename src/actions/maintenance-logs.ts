"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  MaintenanceLog,
  MaintenanceLogFormInput,
} from "@/lib/types/database";

export async function getMaintenanceLogs(): Promise<{
  data: MaintenanceLog[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("maintenanceLog")
    .select(
      "log_id, asset_id, technician_id, maintenance_datenotes, asset:asset_id(asset_type), technician:technician_id(full_name)"
    )
    .order("maintenance_datenotes", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data as unknown as MaintenanceLog[]) ?? [], error: null };
}

export async function createMaintenanceLog(input: MaintenanceLogFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("maintenanceLog").insert(input);

  if (error) return { error: error.message };
  revalidatePath("/maintenance-logs");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateMaintenanceLog(
  logId: number,
  input: MaintenanceLogFormInput
) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("maintenanceLog")
    .update(input)
    .eq("log_id", logId);

  if (error) return { error: error.message };
  revalidatePath("/maintenance-logs");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteMaintenanceLog(logId: number) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("maintenanceLog")
    .delete()
    .eq("log_id", logId);

  if (error) return { error: error.message };
  revalidatePath("/maintenance-logs");
  revalidatePath("/dashboard");
  return { error: null };
}
