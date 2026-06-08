"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAsset, deleteAsset, updateAsset } from "@/actions/assets";
import { ASSET_STATUSES } from "@/lib/constants/statuses";
import type { AppUser, Asset, AssetFormInput } from "@/lib/types/database";
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

type AssetFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: Pick<AppUser, "user_id" | "full_name">[];
  asset?: Asset | null;
};

const emptyForm: AssetFormInput = {
  asset_name: "",
  asset_type: "",
  status: "Active",
  purchase_date: null,
  assigned_user_id: null,
};

export function AssetFormDialog({
  open,
  onOpenChange,
  users,
  asset,
}: AssetFormDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<AssetFormInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(asset);

  function resetForm(nextAsset?: Asset | null) {
    if (nextAsset) {
      setForm({
        asset_name: nextAsset.asset_name,
        asset_type: nextAsset.asset_type,
        status: nextAsset.status,
        purchase_date: nextAsset.purchase_date,
        assigned_user_id: nextAsset.assigned_user_id,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = isEdit
      ? await updateAsset(asset!.asset_id, form)
      : await createAsset(form);

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
        if (nextOpen) resetForm(asset);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Asset" : "Add Asset"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="asset_name">Asset Name</Label>
            <Input
              id="asset_name"
              value={form.asset_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, asset_name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="asset_type">Asset Type</Label>
            <Input
              id="asset_type"
              value={form.asset_type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, asset_type: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  status: value as AssetFormInput["status"],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ASSET_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={form.purchase_date ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  purchase_date: e.target.value || null,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Assigned To</Label>
            <Select
              value={
                form.assigned_user_id ? String(form.assigned_user_id) : "none"
              }
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  assigned_user_id: value === "none" ? null : Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Unassigned</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.user_id} value={String(user.user_id)}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save Changes" : "Create Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useAssetActions() {
  const router = useRouter();

  async function removeAsset(assetId: number) {
    const result = await deleteAsset(assetId);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return { removeAsset };
}
