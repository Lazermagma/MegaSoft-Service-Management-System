"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { roleVariant, USER_ROLES } from "@/lib/constants/statuses";
import type { AppUser, Department } from "@/lib/types/database";
import { StatusBadge } from "@/components/shared/status-badge";
import { DataTableShell } from "@/components/shared/data-table-shell";
import { TableFilters } from "@/components/shared/table-filters";
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
import { UserFormDialog, useUserActions } from "@/components/users/user-form-dialog";

type UsersTableProps = {
  users: AppUser[];
  departments: Department[];
};

export function UsersTable({ users, departments }: UsersTableProps) {
  const { removeUser } = useUserActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.department?.department_name?.toLowerCase().includes(query) ??
          false);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  function openCreate() {
    setSelectedUser(null);
    setDialogOpen(true);
  }

  function openEdit(user: AppUser) {
    setSelectedUser(user);
    setDialogOpen(true);
  }

  return (
    <>
      <DataTableShell
        title="All Users"
        description="Manage employees, technicians, and admins."
        action={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add User
          </Button>
        }
      >
        <TableFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, or department..."
          filters={[
            {
              value: roleFilter,
              onChange: setRoleFilter,
              placeholder: "Role",
              options: [
                { value: "all", label: "All Roles" },
                ...USER_ROLES.map((role) => ({ value: role, label: role })),
              ],
            },
          ]}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No users match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={user.role}
                      variant={roleVariant[user.role]}
                    />
                  </TableCell>
                  <TableCell>
                    {user.department?.department_name ?? "—"}
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
                        <DropdownMenuItem onClick={() => openEdit(user)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            if (
                              confirm(
                                `Delete ${user.full_name}? This action cannot be undone.`
                              )
                            ) {
                              removeUser(user.user_id);
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

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        departments={departments}
        user={selectedUser}
      />
    </>
  );
}
