export type UserRole = "Employee" | "Technician" | "Admin";

export type AssetStatus = "Active" | "Under Maintenance" | "Inactive";

export type RequestPriority = "Low" | "Medium" | "High" | "Critical";

export type RequestStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type Department = {
  department_id: number;
  department_name: string;
};

export type AppUser = {
  user_id: number;
  full_name: string;
  email: string;
  role: UserRole;
  department_id: number;
  created_at: string;
  department?: Pick<Department, "department_name"> | null;
};

export type Asset = {
  asset_id: number;
  asset_name: string;
  asset_type: string;
  status: AssetStatus;
  purchase_date: string | null;
  assigned_user_id: number | null;
  assigned_user?: Pick<AppUser, "full_name"> | null;
};

export type ServiceRequest = {
  request_id: number;
  title: string;
  description: string | null;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  created_by_user_id: number;
  assigned_to_user_id: number | null;
  asset_id: number | null;
  created_by?: Pick<AppUser, "full_name"> | null;
  assigned_to?: Pick<AppUser, "full_name"> | null;
  asset?: Pick<Asset, "asset_name"> | null;
};

export type MaintenanceLog = {
  log_id: number;
  asset_id: number;
  technician_id: number;
  maintenance_date: string;
  notes: string | null;
  asset?: Pick<Asset, "asset_name"> | null;
  technician?: Pick<AppUser, "full_name"> | null;
};

export type UserFormInput = {
  full_name: string;
  email: string;
  role: UserRole;
  department_id: number;
};

export type AssetFormInput = {
  asset_name: string;
  asset_type: string;
  status: AssetStatus;
  purchase_date: string | null;
  assigned_user_id: number | null;
};

export type ServiceRequestFormInput = {
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  created_by_user_id: number;
  assigned_to_user_id: number | null;
  asset_id: number | null;
};
