"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { assignTechnician } from "@/actions/service-requests";
import type { AppUser, ServiceRequest } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssignTechnicianDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
  technicians: Pick<AppUser, "user_id" | "full_name">[];
};

export function AssignTechnicianDialog({
  open,
  onOpenChange,
  request,
  technicians,
}: AssignTechnicianDialogProps) {
  const router = useRouter();
  const [technicianId, setTechnicianId] = useState<string>("none");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function resetSelection(nextRequest: ServiceRequest | null) {
    setTechnicianId(
      nextRequest?.assigned_to_user_id
        ? String(nextRequest.assigned_to_user_id)
        : "none"
    );
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) return;

    setPending(true);
    setError(null);

    const result = await assignTechnician(
      request.request_id,
      technicianId === "none" ? null : Number(technicianId)
    );

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
        if (nextOpen) resetSelection(request);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {request?.title ?? "Select a request to assign."}
          </p>

          <div className="space-y-2">
            <Label>Technician</Label>
            <Select
              value={technicianId}
              onValueChange={(value) => setTechnicianId(value ?? "none")}
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

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending || !request}>
              {pending ? "Assigning..." : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
