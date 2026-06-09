"use server";

import { getSupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { ServiceRequest } from "@/lib/types/database";

export type DashboardStats = {
  userCount: number;
  assetCount: number;
  openRequestCount: number;
  maintenanceLogCount: number;
};

export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  recentRequests: ServiceRequest[];
  error: string | null;
}> {
  const emptyStats: DashboardStats = {
    userCount: 0,
    assetCount: 0,
    openRequestCount: 0,
    maintenanceLogCount: 0,
  };

  const configError = getSupabaseConfigError();
  if (configError) {
    return { stats: emptyStats, recentRequests: [], error: configError };
  }

  const supabase = await createClient();

  const [users, assets, openRequests, logs, recent] = await Promise.all([
    supabase.from("user").select("*", { count: "exact", head: true }),
    supabase.from("asset").select("*", { count: "exact", head: true }),
    supabase
      .from("serviceRequest")
      .select("*", { count: "exact", head: true })
      .eq("status", "Open"),
    supabase
      .from("maintenanceLog")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("serviceRequest")
      .select(
        "request_id, title, priority, status, created_at, asset:asset_id(asset_type), assigned_to:assigned_to_user_id(full_name)"
      )
      .eq("status", "Open")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const error =
    users.error?.message ??
    assets.error?.message ??
    openRequests.error?.message ??
    logs.error?.message ??
    recent.error?.message ??
    null;

  return {
    stats: {
      userCount: users.count ?? 0,
      assetCount: assets.count ?? 0,
      openRequestCount: openRequests.count ?? 0,
      maintenanceLogCount: logs.count ?? 0,
    },
    recentRequests: (recent.data as unknown as ServiceRequest[]) ?? [],
    error,
  };
}
