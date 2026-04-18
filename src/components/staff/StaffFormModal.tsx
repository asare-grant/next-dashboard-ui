"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import StaffForm, { StaffFormValues } from "./StaffForm";

interface Props {
  open: boolean;
  title: string;
  initialData?: StaffFormValues;
  onClose: () => void;
  onSubmit: (data: StaffFormValues) => void;
}

export default function StaffFormModal({
  open,
  title,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#f8f8f8]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <StaffForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
