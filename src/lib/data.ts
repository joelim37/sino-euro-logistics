import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getSiteConfig() {
  noStore();
  const { data, error } = await supabase
    .from("site_config")
    .select("key, value");

  if (error) {
    console.error("Error fetching site config:", error);
    return {};
  }

  const config: Record<string, string> = {};
  data.forEach((item) => {
    config[item.key] = item.value;
  });

  return config;
}

export async function getServices() {
  noStore();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }

  return data;
}

export async function getServiceBySlug(slug: string) {
  noStore();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching service:", error);
    return null;
  }

  return data;
}

export interface Inquiry {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email: string;
  origin?: string;
  destination: string;
  service_type?: string;
  notes?: string;
  status: "pending" | "contacted" | "completed";
  created_at: string;
}

export async function getInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }

  return data as Inquiry[];
}

export async function updateInquiryStatus(
  id: string,
  status: "pending" | "contacted" | "completed"
) {
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating inquiry:", error);
    return null;
  }

  return data;
}

export async function updateSiteConfig(
  key: string,
  value: string
) {
  const { data, error } = await supabase
    .from("site_config")
    .upsert({ key, value, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error updating site config:", error);
    return null;
  }

  return data;
}

export async function updateService(
  id: string,
  updates: Partial<{
    name: string;
    description: string;
    content: string;
    icon: string;
    image: string;
    transit_time: string;
    suitable_for: string;
    sort_order: number;
    is_active: boolean;
  }>
) {
  const { data, error } = await supabase
    .from("services")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating service:", error);
    return null;
  }

  return data;
}

export async function createService(
  service: {
    name: string;
    slug: string;
    description: string;
    content?: string;
    icon?: string;
    image?: string;
    transit_time?: string;
    suitable_for?: string;
    sort_order?: number;
  }
) {
  const { data, error } = await supabase
    .from("services")
    .insert(service)
    .select()
    .single();

  if (error) {
    console.error("Error creating service:", error);
    return null;
  }

  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting service:", error);
    return false;
  }

  return true;
}
