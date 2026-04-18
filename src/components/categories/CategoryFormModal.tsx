"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm, {
  CategoryFormValues,
} from "./CategoryForm";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  initialData?: CategoryFormValues;
  onSubmit: (data: CategoryFormValues) => void;
}

export default function CategoryFormModal({
  open,
  onClose,
  title,
  initialData,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-background text-foreground]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <CategoryForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
