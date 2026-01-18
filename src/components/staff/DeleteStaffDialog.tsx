"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staffName?: string;
}

export default function DeleteStaffDialog({
  open,
  onClose,
  onConfirm,
  staffName,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#babd]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{staffName}</strong>?  
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
