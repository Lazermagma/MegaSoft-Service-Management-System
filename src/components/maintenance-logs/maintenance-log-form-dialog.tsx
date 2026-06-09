"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createMaintenanceLog,
  deleteMaintenanceLog,
  updateMaintenanceLog,
} from "@/actions/maintenance-logs";
import type {
  AppUser,
  Asset,
  MaintenanceLog,
  MaintenanceLogFormInput,
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

type MaintenanceLogFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: Pick<Asset, "asset_id" | "asset_type">[];
  technicians: Pick<AppUser, "user_id" | "full_name">[];
  log?: MaintenanceLog | null;
};

function buildEmptyForm(
  assets: Pick<Asset, "asset_id" | "asset_type">[],
  technicians: Pick<AppUser, "user_id" | "full_name">[]
): MaintenanceLogFormInput {
  return {
    asset_id: assets[0]?.asset_id ?? 0,
    technician_id: technicians[0]?.user_id ?? 0,
    maintenance_datenotes: new Date().toISOString().slice(0, 10),
  };
}

export function MaintenanceLogFormDialog({
  open,
  onOpenChange,
  assets,
  technicians,
  log,
}: MaintenanceLogFormDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<MaintenanceLogFormInput>(
    buildEmptyForm(assets, technicians)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(log);

  function resetForm(nextLog?: MaintenanceLog | null) {
    if (nextLog) {
      setForm({
        asset_id: nextLog.asset_id,
        technician_id: nextLog.technician_id,
        maintenance_datenotes: nextLog.maintenance_datenotes?.slice(0, 10) ?? "",
      });
    } else {
      setForm(buildEmptyForm(assets, technicians));
    }
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = isEdit
      ? await updateMaintenanceLog(log!.log_id, form)
      : await createMaintenanceLog(form);

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
        if (nextOpen) resetForm(log);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Maintenance Log" : "Add Maintenance Log"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Asset</Label>
            <Select
              value={form.asset_id ? String(form.asset_id) : ""}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, asset_id: Number(value) }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.asset_id} value={String(asset.asset_id)}>
                    {asset.asset_type} (#{asset.asset_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Technician</Label>
            <Select
              value={form.technician_id ? String(form.technician_id) : ""}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, technician_id: Number(value) }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="maintenance_datenotes">Maintenance Date</Label>
            <Input
              id="maintenance_datenotes"
              type="date"
              value={form.maintenance_datenotes}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  maintenance_datenotes: e.target.value,
                }))
              }
              required
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save Changes" : "Create Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useMaintenanceLogActions() {
  const router = useRouter();

  async function removeLog(logId: number) {
    const result = await deleteMaintenanceLog(logId);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return { removeLog };
}
