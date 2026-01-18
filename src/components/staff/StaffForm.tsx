"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffRole, StaffStatus } from "@/types/staff";

export type StaffFormValues = {
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  shift: "morning" | "evening" | "night";
  branch: string;
};

interface Props {
  initialData?: StaffFormValues;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
}

export default function StaffForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<StaffFormValues>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    role: initialData?.role ?? "chef",
    status: initialData?.status ?? "active",
    shift: initialData?.shift ?? "morning",
    branch: initialData?.branch ?? "",
  });

  const [error, setError] = useState("");

  const update = (key: keyof StaffFormValues, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!form.fullName || !form.email || !form.phone) {
      setError("Full name, email and phone are required");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Full Name</Label>
        <Input
          value={form.fullName}
          onChange={(e) => update("fullName", e.target.value)}
        />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Role</Label>
          <Select
            value={form.role}
            onValueChange={(v) => update("role", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="chef">Chef</SelectItem>
              <SelectItem value="rider">Rider</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => update("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Shift</Label>
          <Select
            value={form.shift}
            onValueChange={(v) => update("shift", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Branch</Label>
          <Input
            value={form.branch}
            onChange={(e) => update("branch", e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} className="bg-red-300">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-300">Save</Button>
      </div>
    </div>
  );
}
