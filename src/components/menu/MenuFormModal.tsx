"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MenuForm, { MenuFormData } from "./MenuForm";

interface Props {
  open: boolean;
  title: string;
  categories: string[]; // ✅ ADD THIS
  initialData?: MenuFormData;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => void;
}

export default function MenuFormModal({
  open,
  title,
  categories,
  initialData,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl h-[100vh] max-h-[95vh] p-0 bg-background text-foreground flex flex-col">
        {/* HEADER (fixed) */}
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
        <MenuForm
          categories={categories} // ✅ FIX
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
        </div>
      </DialogContent>
    </Dialog>
  );
}
