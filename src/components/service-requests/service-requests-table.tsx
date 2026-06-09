"use client";

import { useMemo, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
  RefreshCw,
} from "lucide-react";
import {
  priorityVariant,
  requestStatusVariant,
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
} from "@/lib/constants/statuses";
import type { AppUser, Asset, ServiceRequest } from "@/lib/types/database";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { TableFilters } from "@/components/shared/table-filters";
import { AssignTechnicianDialog } from "@/components/service-requests/assign-technician-dialog";
import { ServiceRequestFormDialog } from "@/components/service-requests/service-request-form-dialog";
import { UpdateStatusDialog } from "@/components/service-requests/update-status-dialog";
import { deleteServiceRequest } from "@/actions/service-requests";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useRouter } from "next/navigation";

type ServiceRequestsTableProps = {
  requests: ServiceRequest[];
  users: Pick<AppUser, "user_id" | "full_name">[];
  technicians: Pick<AppUser, "user_id" | "full_name">[];
  assets: Pick<Asset, "asset_id" | "asset_type">[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ServiceRequestsTable({
  requests,
  users,
  technicians,
  assets,
}: ServiceRequestsTableProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.title.toLowerCase().includes(query) ||
        (request.assigned_to?.full_name?.toLowerCase().includes(query) ??
          false) ||
        (request.asset?.asset_type?.toLowerCase().includes(query) ?? false);
      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || request.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, search, statusFilter, priorityFilter]);

  function openCreate() {
    setSelectedRequest(null);
    setFormOpen(true);
  }

  function openEdit(request: ServiceRequest) {
    setSelectedRequest(request);
    setFormOpen(true);
  }

  function openAssign(request: ServiceRequest) {
    setSelectedRequest(request);
    setAssignOpen(true);
  }

  function openStatus(request: ServiceRequest) {
    setSelectedRequest(request);
    setStatusOpen(true);
  }

  async function removeRequest(request: ServiceRequest) {
    if (
      !confirm(
        `Delete "${request.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    const result = await deleteServiceRequest(request.request_id);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <DataTableShell
        title="All Service Requests"
        description="Create tickets, assign technicians, and move requests through the workflow."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            New Request
          </Button>
        }
      >
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title, assignee, or asset..."
          filters={[
            {
              value: statusFilter,
              onChange: setStatusFilter,
              placeholder: "Status",
              options: [
                { value: "all", label: "All Statuses" },
                ...REQUEST_STATUSES.map((status) => ({
                  value: status,
                  label: status,
                })),
              ],
            },
            {
              value: priorityFilter,
              onChange: setPriorityFilter,
              placeholder: "Priority",
              options: [
                { value: "all", label: "All Priorities" },
                ...REQUEST_PRIORITIES.map((priority) => ({
                  value: priority,
                  label: priority,
                })),
              ],
            },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground">
                  No service requests match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.request_id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.title}</p>
                      {request.created_by?.full_name ? (
                        <p className="text-xs text-muted-foreground">
                          by {request.created_by.full_name}
                        </p>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={request.priority}
                      variant={priorityVariant[request.priority]}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={request.status}
                      variant={requestStatusVariant[request.status]}
                    />
                  </TableCell>
                  <TableCell>{request.asset?.asset_type ?? "—"}</TableCell>
                  <TableCell>
                    {request.assigned_to?.full_name ?? "Unassigned"}
                  </TableCell>
                  <TableCell>{formatDate(request.created_at)}</TableCell>
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
                        <DropdownMenuItem onClick={() => openAssign(request)}>
                          <UserPlus className="size-4" />
                          Assign Technician
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStatus(request)}>
                          <RefreshCw className="size-4" />
                          Update Status
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEdit(request)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => removeRequest(request)}
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

      <ServiceRequestFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        users={users}
        technicians={technicians}
        assets={assets}
        request={selectedRequest}
      />

      <AssignTechnicianDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        request={selectedRequest}
        technicians={technicians}
      />

      <UpdateStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        request={selectedRequest}
      />
    </>
  );
}
