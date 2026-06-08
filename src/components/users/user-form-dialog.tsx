"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser, deleteUser, updateUser } from "@/actions/users";
import { USER_ROLES } from "@/lib/constants/statuses";
import type { AppUser, Department, UserFormInput } from "@/lib/types/database";
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

type UserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: Department[];
  user?: AppUser | null;
};

const emptyForm: UserFormInput = {
  full_name: "",
  email: "",
  role: "Employee",
  department_id: 0,
};

export function UserFormDialog({
  open,
  onOpenChange,
  departments,
  user,
}: UserFormDialogProps) {
  const router = useRouter();
  const [form, setForm] = useState<UserFormInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isEdit = Boolean(user);

  function resetForm(nextUser?: AppUser | null) {
    if (nextUser) {
      setForm({
        full_name: nextUser.full_name,
        email: nextUser.email,
        role: nextUser.role,
        department_id: nextUser.department_id,
      });
    } else {
      setForm({
        ...emptyForm,
        department_id: departments[0]?.department_id ?? 0,
      });
    }
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = isEdit
      ? await updateUser(user!.user_id, form)
      : await createUser(form);

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
        if (nextOpen) resetForm(user);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, full_name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  role: value as UserFormInput["role"],
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={String(form.department_id || "")}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  department_id: Number(value),
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem
                    key={department.department_id}
                    value={String(department.department_id)}
                  >
                    {department.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function useUserActions() {
  const router = useRouter();

  async function removeUser(userId: number) {
    const result = await deleteUser(userId);
    if (result.error) {
      alert(result.error);
      return;
    }
    router.refresh();
  }

  return { removeUser };
}
