"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { assetStatusVariant } from "@/lib/constants/statuses";
import type { AppUser, Asset } from "@/lib/types/database";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { AssetFormDialog, useAssetActions } from "@/components/assets/asset-form-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AssetsTableProps = {
  assets: Asset[];
  users: Pick<AppUser, "user_id" | "full_name">[];
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function AssetsTable({ assets, users }: AssetsTableProps) {
  const { removeAsset } = useAssetActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  function openCreate() {
    setSelectedAsset(null);
    setDialogOpen(true);
  }

  function openEdit(asset: Asset) {
    setSelectedAsset(asset);
    setDialogOpen(true);
  }

  return (
    <>
      <DataTableShell
        title="All Assets"
        description="Track hardware, equipment, and user assignments."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add Asset
          </Button>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No assets found.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset.asset_id}>
                  <TableCell className="font-medium">{asset.asset_name}</TableCell>
                  <TableCell>{asset.asset_type}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={asset.status}
                      variant={assetStatusVariant[asset.status]}
                    />
                  </TableCell>
                  <TableCell>{formatDate(asset.purchase_date)}</TableCell>
                  <TableCell>
                    {asset.assigned_user?.full_name ?? "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(asset)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete ${asset.asset_name}? This action cannot be undone.`
                              )
                            ) {
                              removeAsset(asset.asset_id);
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </DataTableShell>

      <AssetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        users={users}
        asset={selectedAsset}
      />
    </>
  );
}
