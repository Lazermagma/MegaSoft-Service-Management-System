"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateRequestStatus } from "@/actions/service-requests";
import { REQUEST_STATUSES } from "@/lib/constants/statuses";
import type { RequestStatus, ServiceRequest } from "@/lib/types/database";
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

type UpdateStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
};

export function UpdateStatusDialog({
  open,
  onOpenChange,
  request,
}: UpdateStatusDialogProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>("Open");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function resetStatus(nextRequest: ServiceRequest | null) {
    setStatus(nextRequest?.status ?? "Open");
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request) return;

    setPending(true);
    setError(null);

    const result = await updateRequestStatus(request.request_id, status);

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
        if (nextOpen) resetStatus(request);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {request?.title ?? "Select a request to update."}
          </p>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as RequestStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {REQUEST_STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={pending || !request}>
              {pending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
