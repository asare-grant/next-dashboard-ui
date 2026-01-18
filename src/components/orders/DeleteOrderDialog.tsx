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
  orderRef?: string;
}

export default function DeleteOrderDialog({ open, onClose, onConfirm, orderRef }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#babd]">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order <strong>{orderRef}</strong>?  
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
