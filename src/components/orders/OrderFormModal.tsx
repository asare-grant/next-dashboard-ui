"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderForm, { OrderFormValues } from "./OrderForm";
import type { OrderStatus } from "@/types/order";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  initialData: OrderFormValues;

  // ✅ FIX: OrderForm only submits orderStatus
  onSubmit: (data: { orderStatus: OrderStatus }) => void;
}

export default function OrderFormModal({
  open,
  onClose,
  title,
  initialData,
  onSubmit,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-xl bg-[#fafafa]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <OrderForm initialData={initialData} onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
}

export function OrderTimeline({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div key={log.$id} className="border-l-2 pl-4">
          <p className="text-sm font-medium">
            {log.previousStatus} → {log.newStatus}
          </p>
          <p className="text-xs text-gray-500">
            {log.performedByRole} • {new Date(log.$createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
