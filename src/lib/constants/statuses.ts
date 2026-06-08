import type {
  AssetStatus,
  RequestPriority,
  RequestStatus,
  UserRole,
} from "@/lib/types/database";

export const USER_ROLES: UserRole[] = ["Employee", "Technician", "Admin"];

export const ASSET_STATUSES: AssetStatus[] = [
  "Active",
  "Under Maintenance",
  "Inactive",
];

export const REQUEST_PRIORITIES: RequestPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const REQUEST_STATUSES: RequestStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

export const requestStatusVariant: Record<
  RequestStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Open: "secondary",
  "In Progress": "default",
  Resolved: "outline",
  Closed: "outline",
};

export const priorityVariant: Record<
  RequestPriority,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Low: "secondary",
  Medium: "outline",
  High: "default",
  Critical: "destructive",
};

export const assetStatusVariant: Record<
  AssetStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  Active: "default",
  "Under Maintenance": "secondary",
  Inactive: "outline",
};

export const roleVariant: Record<
  UserRole,
  "default" | "secondary" | "outline"
> = {
  Employee: "outline",
  Technician: "secondary",
  Admin: "default",
};
