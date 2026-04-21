"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Staff } from "@/types/staff";
import {
  getAllStaffAdmin,
  createStaffAdmin,
  updateStaffAdmin,
  deleteStaffAdmin,
} from "@/lib/api/staff";
import StaffFormModal from "@/components/staff/StaffFormModal";
import DeleteStaffDialog from "@/components/staff/DeleteStaffDialog";

import { useTheme } from "next-themes";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const currentUserRole: "admin" | "manager" = "admin";

  const { theme } = useTheme();

  const gridRef = useRef<AgGridReact<Staff>>(null);

   /* ================= LOAD STAFF ================= */
  // const loadStaff = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await getAllStaffAdmin();

  //     const normalized: Staff[] = res.staff.map((s: any) => ({
  //       id: s.$id,
  //       fullName: s.fullName,
  //       email: s.email,
  //       role: s.role,
  //       phone: s.phone,
  //       branch: s.branch,
  //       shift: s.shift,
  //       status: s.status,
  //       joinedAt: s.joinedAt,
  //       avatar: s.avatar,
  //     }));

  //     setStaff(normalized);
  //   } catch (err: any) {
  //     toast.error(err.message || "Failed to load staff");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    loadStaff();
  }, []);

  /* ---------------- MODAL HANDLERS ---------------- */
  const openCreateModal = () => {
    setEditingStaff(null);
    setModalOpen(true);
  };

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    setModalOpen(true);
  };

  const handleSave = async (data: Partial<Staff>) => {
    try {
      if (editingStaff) {
        await updateStaffAdmin(editingStaff.id, data);
        toast.success("Staff updated successfully");
      } else {
        await createStaffAdmin({
          fullName: data.fullName!,
          email: data.email!,
          role: data.role!,
          phone: data.phone,
          branch: data.branch,
          shift: data.shift,
          status: data.status,
        });
        toast.success("Staff created successfully");
      }

      setModalOpen(false);
      setEditingStaff(null);
      await loadStaff();
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
      console.error("Staff save error:", err);
    }
  };

  const requestDelete = (staff: Staff) => {
    setStaffToDelete(staff);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;

    try {
      await deleteStaffAdmin(staffToDelete.id);
      toast.success("Staff deleted successfully");
      await loadStaff();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
      console.error("Delete error:", err);
    } finally {
      setDeleteOpen(false);
    }
  };

  /* ---------------- COLUMN DEFINITIONS ---------------- */
  const columnDefs = useMemo<ColDef<Staff>[]>(
    () => [
      { headerName: "Staff ID", field: "id", minWidth: 120 },
      {
        headerName: "Full Name",
        field: "fullName",
        minWidth: 180,
        cellRenderer: (params: any) => (
          <div className="flex flex-col">
            <span className="font-medium">{params.value}</span>
            <span className="text-xs text-gray-500">{params.data.email}</span>
          </div>
        ),
      },
      {
        headerName: "Role",
        field: "role",
        minWidth: 120,
        cellRenderer: (params: any) => {
          const map: Record<string, string> = {
            admin: "bg-purple-200",
            manager: "bg-blue-200",
            chef: "bg-orange-200",
            rider: "bg-green-200",
            cashier: "bg-yellow-200",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                map[params.value]
              }`}
            >
              {params.value.toUpperCase()}
            </span>
          );
        },
      },
      { headerName: "Phone", field: "phone", minWidth: 140 },
      { headerName: "Branch", field: "branch", minWidth: 140 },
      {
        headerName: "Shift",
        field: "shift",
        minWidth: 120,
        valueFormatter: (p) => p.value?.toUpperCase() ?? "",
      },
      {
        headerName: "Status",
        field: "status",
        minWidth: 120,
        cellRenderer: (params: any) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              params.value === "active" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {params.value?.toUpperCase() ?? ""}
          </span>
        ),
      },
      {
        headerName: "Joined",
        field: "joinedAt",
        minWidth: 170,
        valueFormatter: (params) =>
          params.value
            ? new Date(params.value).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
      },
      {
        headerName: "Actions",
        width: 150,
        cellRenderer: (params: any) => (
          <div className="row-actions flex gap-2 opacity-50 hover:opacity-100 transition">
            <Button
              size="icon"
              variant="outline"
              className="bg-green-300"
              onClick={() => openEditModal(params.data)}
            >
              <Pencil size={16} />
            </Button>

            {currentUserRole === "admin" && (
              <Button
                size="icon"
                variant="destructive"
                className="bg-red-300"
                onClick={() => requestDelete(params.data)}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  /* ---------------- AG GRID THEME --------------- */
  const gridTheme = useMemo(() => {
    const isDark = theme === "dark";
  
    return themeQuartz.withParams({
      spacing: 6,
      rowBorder: true,
      foregroundColor: isDark ? "#e5e7eb" : "#1f2937",
      backgroundColor: isDark ? "#020617" : "#ffffff",
      headerBackgroundColor: isDark ? "#020617" : "#f1f5f9",
      rowHoverColor: isDark ? "#1e293b" : "#e0e7ff",
      borderRadius: 12,
      borderWidth: 2,
    });
  }, [theme]);

  /* ---------------- FETCH STAFF DATA ---------------- */
  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await getAllStaffAdmin();

      const normalizedStaff: Staff[] = res.staff.map((s: any) => ({
        id: s.$id, // 🔑 Important for AG Grid
        fullName: s.fullName,
        email: s.email,
        role: s.role,
        phone: s.phone,
        branch: s.branch,
        shift: s.shift,
        status: s.status,
        joinedAt: s.joinedAt,
        avatar: s.avatar,
      }));

      setStaff(normalizedStaff);
    } catch (err) {
      toast.error("Failed to load staff");
      console.error("Load staff error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-muted rounded-xl p-4 m-4 mt-0 flex-1">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-blue-300">Staff</h1>
        <Button
          className="bg-blue-300 text-foreground"
          onClick={openCreateModal}
          disabled={currentUserRole !== "admin"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="h-[520px] flex items-center justify-center text-foreground">
          Loading staff...
        </div>
      ) : (
        <div className="ag-custom-grid w-full h-[520px] rounded-xl overflow-hidden border">
          <AgGridReact<Staff>
            ref={gridRef}
            rowData={staff}
            columnDefs={columnDefs}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            suppressCellFocus
            animateRows
            rowSelection={{
              mode: "singleRow",
            }}
            headerHeight={55}
            rowHeight={64}
            getRowClass={() => "ag-row-hover-actions"}
          />
        </div>
      )}

      {/* MODALS */}
      <StaffFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? "Edit Staff" : "Add Staff"}
        initialData={editingStaff ?? undefined}
        onSubmit={handleSave}
      />

      <DeleteStaffDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        staffName={staffToDelete?.fullName}
      />
    </div>
  );
}


// {printOpen && selectedOrder && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           {/* BACKDROP */}
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setPrintOpen(false)}
//           />

//           {/* PANEL */}
//           <div className="relative w-[350px] h-full bg-card text-card-foreground shadow-xl p-4 overflow-y-auto">
//             {/* HEADER */}
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold text-lg text-foreground">
//                 Receipt Preview
//               </h2>
//               <Button variant="ghost" onClick={() => setPrintOpen(false)}>
//                 ✕
//               </Button>
//             </div>

//             {/* RECEIPT CONTENT */}
//             <div id="print-area" className="font-mono text-sm">
//               <div className="flex justify-center gap-4 items-center mb-2">
//                 <Image
//                   src="/splash-icon.png"
//                   alt="logo"
//                   width={30}
//                   height={30}
//                 />
//                 <h2 className="text-center font-bold text-lg">RAAJ FOODS</h2>
//               </div>

//               <p>Order Ref: {selectedOrder.id}</p>
//               <p>Date: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
//               <p>Type: {selectedOrder.fulfillmentType}</p>
//               <p>
//                 <strong>Phone:</strong> +{selectedOrder.customerPhone || "—"}
//               </p>
//               {/* {selectedOrder.address && (
//                 <p className="mt-1">
//                   <strong>Address:</strong> {selectedOrder.address.fullAddress}
//                 </p>
//               )} */}

//               <div className="border-t border-dashed my-3" />

//               {/* ITEMS */}
//               {selectedOrder.items.map((item: any, i: number) => {
//                 const qty = item.quantity || 1;
//                 const total = qty * item.unitPrice;

//                 const customizations = item.customizations
//                   ? JSON.parse(item.customizations)
//                   : [];

//                 const drinks = item.drinks ? JSON.parse(item.drinks) : [];

//                 return (
//                   <div key={i} className="mb-2">
//                     <div className="flex justify-between">
//                       <span>
//                         {qty} x {item.name}
//                       </span>
//                       <span>₵{total.toFixed(2)}</span>
//                     </div>

//                     <p className="text-xs">
//                       ₵{item.unitPrice} each | {item.packaging}
//                     </p>

//                     {drinks.length > 0 && (
//                       <p className="text-xs">Drinks: {drinks.join(", ")}</p>
//                     )}

//                     {customizations.length > 0 && (
//                       <p className="text-xs">
//                         Extras: {customizations.join(", ")}
//                       </p>
//                     )}
//                   </div>
//                 );
//               })}

//               <div className="border-t border-dashed my-3" />

//               {/* SUMMARY */}
//               <div className="flex justify-between">
//                 <span>Items Total</span>
//                 <span>₵{selectedOrder.total.toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>₵{(selectedOrder.deliveryFee || 0).toFixed(2)}</span>
//               </div>

//               <div className="flex justify-between font-bold text-base mt-1">
//                 <span>Grand Total</span>
//                 <span>
//                   ₵
//                   {(
//                     selectedOrder.total + (selectedOrder.deliveryFee || 0)
//                   ).toFixed(2)}
//                 </span>
//               </div>

//               <div className="border-t border-dashed my-3" />

//               <p>Payment: {selectedOrder.paymentStatus?.toUpperCase()}</p>
//               <p>Status: {selectedOrder.orderStatus?.toUpperCase()}</p>

//               <p className="text-center mt-3 text-xs">
//                 Thank you for your order ❤️
//               </p>
//             </div>

//             {/* PRINT BUTTON */}
//             <div className="mt-6 flex items-center justify-center">
//               <Button
//                 className=" w-content bg-[#17972a80] text-gray-50"
//                 onClick={() => handlePrintNow()}
//               >
//                 Print Receipt
//                 <Printer size={16} />
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}