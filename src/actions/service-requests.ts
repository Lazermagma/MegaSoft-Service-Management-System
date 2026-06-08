"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  RequestStatus,
  ServiceRequest,
  ServiceRequestFormInput,
} from "@/lib/types/database";

export async function getServiceRequests(): Promise<{
  data: ServiceRequest[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_request")
    .select(
      `
      request_id,
      title,
      description,
      priority,
      status,
      created_at,
      created_by_user_id,
      assigned_to_user_id,
      asset_id,
      created_by:created_by_user_id(full_name),
      assigned_to:assigned_to_user_id(full_name),
      asset:asset_id(asset_name)
    `
    )
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data as unknown as ServiceRequest[]) ?? [], error: null };
}

export async function createServiceRequest(input: ServiceRequestFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("service_request").insert(input);

  if (error) return { error: error.message };
  revalidatePath("/service-requests");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateServiceRequest(
  requestId: number,
  input: ServiceRequestFormInput
) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("service_request")
    .update(input)
    .eq("request_id", requestId);

  if (error) return { error: error.message };
  revalidatePath("/service-requests");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function assignTechnician(
  requestId: number,
  technicianId: number | null
) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("service_request")
    .update({ assigned_to_user_id: technicianId })
    .eq("request_id", requestId);

  if (error) return { error: error.message };
  revalidatePath("/service-requests");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateRequestStatus(
  requestId: number,
  status: RequestStatus
) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("service_request")
    .update({ status })
    .eq("request_id", requestId);

  if (error) return { error: error.message };
  revalidatePath("/service-requests");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteServiceRequest(requestId: number) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("service_request")
    .delete()
    .eq("request_id", requestId);

  if (error) return { error: error.message };
  revalidatePath("/service-requests");
  revalidatePath("/dashboard");
  return { error: null };
}
