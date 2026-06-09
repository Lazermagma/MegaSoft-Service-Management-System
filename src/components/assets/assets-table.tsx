"use client";

import { useCallback, useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { ASSET_STATUSES, assetStatusVariant } from "@/lib/constants/statuses";
import type { AppUser, Asset } from "@/lib/types/database";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { TableFilters } from "@/components/shared/table-filters";
import { SortableHeader } from "@/components/shared/sortable-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTableSort } from "@/hooks/use-table-sort";
import { deleteAsset } from "@/actions/assets";
import { useRouter } from "next/navigation";
import { AssetFormDialog } from "@/components/assets/asset-form-dialog";
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
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesSearch =
        !query ||
        asset.asset_type.toLowerCase().includes(query) ||
        (asset.assigned_user?.full_name?.toLowerCase().includes(query) ??
          false);
      const matchesStatus =
        statusFilter === "all" || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  const getSortValue = useCallback((asset: Asset, key: string) => {
    switch (key) {
      case "asset_id":
        return asset.asset_id;
      case "asset_type":
        return asset.asset_type;
      case "status":
        return asset.status;
      case "purchase_date":
        return asset.purchase_date ?? "";
      case "assigned_user":
        return asset.assigned_user?.full_name ?? "";
      default:
        return null;
    }
  }, []);

  const { sorted, sortKey, sortDir, toggleSort } = useTableSort(
    filteredAssets,
    getSortValue
  );

  function openCreate() {
    setSelectedAsset(null);
    setDialogOpen(true);
  }

  function openEdit(asset: Asset) {
    setSelectedAsset(asset);
    setDialogOpen(true);
  }

  function openDelete(asset: Asset) {
    setDeleteError(null);
    setAssetToDelete(asset);
  }

  async function confirmDelete() {
    if (!assetToDelete) return;
    setDeletePending(true);
    setDeleteError(null);
    const result = await deleteAsset(assetToDelete.asset_id);
    setDeletePending(false);
    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    setAssetToDelete(null);
    router.refresh();
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
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by type or assignee..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              placeholder: "Status",
              options: [
                { value: "all", label: "All Statuses" },
                ...ASSET_STATUSES.map((status) => ({
                  value: status,
                  label: status,
                })),
              ],
            },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                label="ID"
                sortKey="asset_id"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
                className="w-16"
              />
              <SortableHeader
                label="Type"
                sortKey="asset_type"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Status"
                sortKey="status"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Purchase Date"
                sortKey="purchase_date"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Assigned To"
                sortKey="assigned_user"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  No assets match your search.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((asset) => (
                <TableRow key={asset.asset_id}>
                  <TableCell className="text-muted-foreground">
                    #{asset.asset_id}
                  </TableCell>
                  <TableCell className="font-medium">{asset.asset_type}</TableCell>
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
                          onClick={() => openDelete(asset)}
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

      <ConfirmDialog
        open={Boolean(assetToDelete)}
        onOpenChange={(open) => {
          if (!open) setAssetToDelete(null);
        }}
        title="Delete asset"
        description={
          assetToDelete
            ? `Delete this ${assetToDelete.asset_type} (#${assetToDelete.asset_id})? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        pending={deletePending}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </>
  );
}
