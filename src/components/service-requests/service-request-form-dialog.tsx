"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createServiceRequest,
  updateServiceRequest,
} from "@/actions/service-requests";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
} from "@/lib/constants/statuses";
import type {
  AppUser,
  Asset,
  RequestStatus,
  ServiceRequest,
  ServiceRequestFormInput,
} from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ServiceRequestFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: Pick<AppUser, "user_id" | "full_name">[];
  technicians: Pick<AppUser, "user_id" | "full_name">[];
  assets: Pick<Asset, "asset_id" | "asset_name">[];
  request?: ServiceRequest | null;
};

function buildEmptyForm(
  users: Pick<AppUser, "user_id" | "full_name">[]
): ServiceRequestFormInput {
  return {
    title: "",
    description: "",
    priority: "Medium",
    status: "Open",
    created_by_user_id: users[0]?.user_id ?? 0,
    assigned_to_user_id: null,
    asset_id: null,
  };
}

export function ServiceRequestFormDialog({
  open,
  onOpenChange,
  users,
  technicians,
  assets,
  request,
}: ServiceRequestFormDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<ServiceRequestFormInput>(
    buildEmptyForm(users)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(request);

  function resetForm(nextRequest?: ServiceRequest | null) {
    if (nextRequest) {
      setForm({
        title: nextRequest.title,
        description: nextRequest.description ?? "",
        priority: nextRequest.priority,
        status: nextRequest.status,
        created_by_user_id: nextRequest.created_by_user_id,
        assigned_to_user_id: nextRequest.assigned_to_user_id,
        asset_id: nextRequest.asset_id,
      });
    } else {
      setForm(buildEmptyForm(users));
    }
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = isEdit
      ? await updateServiceRequest(request!.request_id, form)
      : await createServiceRequest(form);

    setPending(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (nextOpen) resetForm(request);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Service Request" : "New Service Request"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: value as ServiceRequestFormInput["priority"],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_PRIORITIES.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    status: value as RequestStatus,
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {REQUEST_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Created By</Label>
            <Select
              value={String(form.created_by_user_id || "")}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  created_by_user_id: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={String(user.user_id)}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Technician</Label>
            <Select
              value={
                form.assigned_to_user_id
                  ? String(form.assigned_to_user_id)
                  : "none"
              }
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  assigned_to_user_id: value === "none" ? null : Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {technicians.map((technician) => (
                  <SelectItem
                    key={technician.user_id}
                    value={String(technician.user_id)}
                  >
                    {technician.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Related Asset</Label>
            <Select
              value={form.asset_id ? String(form.asset_id) : "none"}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  asset_id: value === "none" ? null : Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {assets.map((asset) => (
                  <SelectItem key={asset.asset_id} value={String(asset.asset_id)}>
                    {asset.asset_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
