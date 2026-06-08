"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { AppUser, Department, UserFormInput } from "@/lib/types/database";

export async function getDepartments(): Promise<{
  data: Department[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("department")
    .select("department_id, department_name")
    .order("department_name");

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function getUsers(): Promise<{
  data: AppUser[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user")
    .select(
      "user_id, full_name, email, role, department_id, created_at, department:department_id(department_name)"
    )
    .order("full_name");

  if (error) return { data: [], error: error.message };
  return { data: (data as unknown as AppUser[]) ?? [], error: null };
}

export async function getTechnicians(): Promise<{
  data: Pick<AppUser, "user_id" | "full_name">[];
  error: string | null;
}> {
  const configError = getSupabaseConfigError();
  if (configError) return { data: [], error: configError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user")
    .select("user_id, full_name")
    .eq("role", "Technician")
    .order("full_name");

  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function createUser(input: UserFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("user").insert(input);

  if (error) return { error: error.message };
  revalidatePath("/users");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function updateUser(userId: number, input: UserFormInput) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("user").update(input).eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/users");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteUser(userId: number) {
  const configError = getSupabaseConfigError();
  if (configError) return { error: configError };

  const supabase = await createClient();
  const { error } = await supabase.from("user").delete().eq("user_id", userId);

  if (error) return { error: error.message };
  revalidatePath("/users");
  revalidatePath("/dashboard");
  return { error: null };
}
