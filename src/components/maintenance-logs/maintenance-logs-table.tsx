"use client";

import { useCallback, useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import type { AppUser, Asset, MaintenanceLog } from "@/lib/types/database";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { TableFilters } from "@/components/shared/table-filters";
import { SortableHeader } from "@/components/shared/sortable-header";
import { useTableSort } from "@/hooks/use-table-sort";
import {
  MaintenanceLogFormDialog,
  useMaintenanceLogActions,
} from "@/components/maintenance-logs/maintenance-log-form-dialog";
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

type MaintenanceLogsTableProps = {
  logs: MaintenanceLog[];
  assets: Pick<Asset, "asset_id" | "asset_type">[];
  technicians: Pick<AppUser, "user_id" | "full_name">[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MaintenanceLogsTable({
  logs,
  assets,
  technicians,
}: MaintenanceLogsTableProps) {
  const { removeLog } = useMaintenanceLogActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<MaintenanceLog | null>(null);
  const [search, setSearch] = useState("");

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return logs;
    return logs.filter(
      (log) =>
        (log.asset?.asset_type?.toLowerCase().includes(query) ?? false) ||
        (log.technician?.full_name?.toLowerCase().includes(query) ?? false)
    );
  }, [logs, search]);

  const getSortValue = useCallback((log: MaintenanceLog, key: string) => {
    switch (key) {
      case "log_id":
        return log.log_id;
      case "asset":
        return log.asset?.asset_type ?? "";
      case "technician":
        return log.technician?.full_name ?? "";
      case "maintenance_datenotes":
        return log.maintenance_datenotes ?? "";
      default:
        return null;
    }
  }, []);

  const { sorted, sortKey, sortDir, toggleSort } = useTableSort(
    filteredLogs,
    getSortValue,
    { key: "maintenance_datenotes", dir: "desc" }
  );

  function openCreate() {
    setSelectedLog(null);
    setDialogOpen(true);
  }

  function openEdit(log: MaintenanceLog) {
    setSelectedLog(log);
    setDialogOpen(true);
  }

  return (
    <>
      <DataTableShell
        title="All Maintenance Logs"
        description="Record and review maintenance performed on assets."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add Log
          </Button>
        }
      >
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by asset or technician..."
        />
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                label="ID"
                sortKey="log_id"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
                className="w-16"
              />
              <SortableHeader
                label="Asset"
                sortKey="asset"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Technician"
                sortKey="technician"
                activeKey={sortKey}
                direction={sortDir}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Date"
                sortKey="maintenance_datenotes"
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
                <TableCell colSpan={5} className="text-muted-foreground">
                  No maintenance logs match your search.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((log) => (
                <TableRow key={log.log_id}>
                  <TableCell className="text-muted-foreground">
                    #{log.log_id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.asset?.asset_type ?? "—"}
                  </TableCell>
                  <TableCell>{log.technician?.full_name ?? "—"}</TableCell>
                  <TableCell>{formatDate(log.maintenance_datenotes)}</TableCell>
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
                        <DropdownMenuItem onClick={() => openEdit(log)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this maintenance log? This action cannot be undone."
                              )
                            ) {
                              removeLog(log.log_id);
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

      <MaintenanceLogFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        assets={assets}
        technicians={technicians}
        log={selectedLog}
      />
    </>
  );
}
