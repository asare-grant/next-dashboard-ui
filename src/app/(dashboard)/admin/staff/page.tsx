// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { AgGridReact } from "ag-grid-react";
// import type { ColDef } from "ag-grid-community";
// import { themeQuartz } from "ag-grid-community";
// import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";

// import { Button } from "@/components/ui/button";
// import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
// import { toast } from "react-toastify";

// import { Staff } from "@/types/staff";
// import { STAFF_DATA } from "@/utils/data";
// import {
//   getAllStaffAdmin,
//   createStaffAdmin,
//   updateStaffAdmin,
//   deleteStaffAdmin,
// } from "@/lib/api/adminStaff";
// import StaffFormModal from "@/components/staff/StaffFormModal";
// import DeleteStaffDialog from "@/components/staff/DeleteStaffDialog";

// ModuleRegistry.registerModules([AllCommunityModule]);

// export default function StaffPage() {
//   const [staff, setStaff] = useState<Staff[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
//   const currentUserRole: "admin" | "manager" = "admin";

//   const [editingCategory, setEditingCategory] = useState<Staff | null>(null);

//   const gridRef = useRef<AgGridReact<Staff>>(null);

//   const openCreateModal = () => {
//     setEditingStaff(null);
//     setModalOpen(true);
//   };

//   const openEditModal = (staff: Staff) => {
//     setEditingStaff(staff);
//     setModalOpen(true);
//   };

//   const handleSave = async (data: Partial<Staff>) => {
//     try {
//       if (editingStaff) {
//         await updateStaffAdmin(editingStaff.id, data);
//         toast.success("Staff updated");
//       } else {
//         await createStaffAdmin({
//           fullName: data.fullName!,
//           email: data.email!,
//           role: data.role!,
//           phone: data.phone,
//           branch: data.branch,
//           shift: data.shift,
//           status: data.status,
//         });
//         toast.success("Staff created");
//       }

//       setModalOpen(false);
//       setEditingStaff(null);
//       await loadStaff();
//     } catch (err: any) {
//       toast.error(err.message || "Operation failed");
//       console.error("Staff save error:", err);
//     }
//   };

//   const requestDelete = (staff: Staff) => {
//     setStaffToDelete(staff);
//     setDeleteOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!staffToDelete) return;

//     try {
//       await deleteStaffAdmin(staffToDelete.id);
//       toast.success("Staff deleted");
//       loadStaff();
//     } catch (err) {
//       toast.error("Delete failed");
//       console.log("Error", err);
//     } finally {
//       setDeleteOpen(false);
//     }
//   };

//   /* ---------------- COLUMN DEFINITIONS ---------------- */
//   const columnDefs = useMemo<ColDef<Staff>[]>(
//     () => [
//       {
//         headerName: "Staff ID",
//         field: "id",
//         minWidth: 120,
//       },
//       {
//         headerName: "Full Name",
//         field: "fullName",
//         minWidth: 180,
//         cellRenderer: (params: any) => (
//           <div className="flex flex-col">
//             <span className="font-medium">{params.value}</span>
//             <span className="text-xs text-gray-500">{params.data.email}</span>
//           </div>
//         ),
//       },
//       {
//         headerName: "Role",
//         field: "role",
//         minWidth: 120,
//         cellRenderer: (params: any) => {
//           const map: Record<string, string> = {
//             admin: "bg-purple-200",
//             manager: "bg-blue-200",
//             chef: "bg-orange-200",
//             rider: "bg-green-200",
//             cashier: "bg-yellow-200",
//           };
//           return (
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${
//                 map[params.value]
//               }`}
//             >
//               {params.value.toUpperCase()}
//             </span>
//           );
//         },
//       },
//       {
//         headerName: "Phone",
//         field: "phone",
//         minWidth: 140,
//       },
//       {
//         headerName: "Branch",
//         field: "branch",
//         minWidth: 140,
//       },
//       {
//         headerName: "Shift",
//         field: "shift",
//         minWidth: 120,
//         valueFormatter: (p) => p.value.toUpperCase(),
//       },
//       {
//         headerName: "Status",
//         field: "status",
//         minWidth: 120,
//         cellRenderer: (params: any) => (
//           <span
//             className={`px-2 py-1 rounded-full text-xs font-medium ${
//               params.value === "active" ? "bg-green-200" : "bg-red-200"
//             }`}
//           >
//             {params.value.toUpperCase()}
//           </span>
//         ),
//       },
//       {
//         headerName: "Joined",
//         field: "joinedAt",
//         minWidth: 170,
//         valueFormatter: (params) =>
//           new Date(params.value).toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           }),
//       },
//       {
//         headerName: "Actions",
//         width: 150,
//         cellRenderer: (params: any) => (
//           <div className="row-actions flex gap-2 opacity-50 hover:opacity-100 transition">
//             <Button
//               size="icon"
//               variant="outline"
//               className="bg-green-300"
//               onClick={() => openEditModal(params.data)}
//             >
//               <Pencil size={16} />
//             </Button>

//             {currentUserRole === "admin" && (
//               <Button
//                 size="icon"
//                 variant="destructive"
//                 className="bg-red-300"
//                 onClick={() => requestDelete(params.data)}
//               >
//                 <Trash2 size={16} />
//               </Button>
//             )}
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   /* ---------------- AG GRID THEME ---------------- */
//   const gridTheme = themeQuartz.withParams({
//     spacing: 6,
//     rowBorder: true,
//     headerBackgroundColor: "#f1f5f9",
//     rowHoverColor: "#eef2ff",
//     borderRadius: 12,
//   });

//   /* ---------------- FETCH MOCK DATA ---------------- */
//   useEffect(() => {
//     loadStaff();
//   }, []);

//   const loadStaff = async () => {
//     try {
//       setLoading(true);

//       const res = await getAllStaffAdmin();

//       const normalizedStaff: Staff[] = res.staff.map((s: any) => ({
//         id: s.$id, // 🔥 IMPORTANT
//         fullName: s.fullName,
//         email: s.email,
//         role: s.role,
//         phone: s.phone,
//         branch: s.branch,
//         shift: s.shift,
//         status: s.status,
//         joinedAt: s.joinedAt,
//         avatar: s.avatar,
//         accountId: s.accountId,
//       }));

//       setStaff(normalizedStaff);
//     } catch (err) {
//       toast.error("Failed to load staff");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl p-4 m-4 mt-0 flex-1">
//       {/* HEADER */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-lg font-semibold">Staff</h1>
//         <Button
//           className="bg-blue-300 text-white"
//           onClick={openCreateModal}
//           disabled={currentUserRole !== "admin"}
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Staff
//         </Button>
//       </div>

//       {/* GRID */}
//       {loading ? (
//         <div className="h-[520px] flex items-center justify-center text-gray-500">
//           Loading staff...
//         </div>
//       ) : (
//         <div className="ag-custom-grid w-full h-[520px] rounded-xl overflow-hidden border">
//           <AgGridReact<Staff>
//             ref={gridRef}
//             rowData={staff}
//             columnDefs={columnDefs}
//             pagination
//             paginationPageSize={10}
//             paginationPageSizeSelector={[10, 20, 50]}
//             suppressCellFocus
//             animateRows
//             rowSelection={{
//               mode: "singleRow",
//             }}
//             headerHeight={55}
//             rowHeight={64}
//             theme={gridTheme}
//           />
//         </div>
//       )}
//       <StaffFormModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editingStaff ? "Edit Staff" : "Add Staff"}
//         initialData={editingStaff ?? undefined}
//         onSubmit={handleSave}
//       />

//       <DeleteStaffDialog
//         open={deleteOpen}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={confirmDelete}
//         staffName={staffToDelete?.fullName}
//       />
//     </div>
//   );
// }

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

ModuleRegistry.registerModules([AllCommunityModule]);

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);

  const currentUserRole: "admin" | "manager" = "admin";

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
  const gridTheme = themeQuartz.withParams({
    spacing: 6,
    rowBorder: true,
    foregroundColor: "#1f2937",
    backgroundColor: "#ffffff",
    headerBackgroundColor: "#f1f5f9",
    rowHoverColor: "#e0e7ff",
    borderRadius: 12,
    borderWidth: 2,
  });

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
    <div className="bg-white rounded-xl p-4 m-4 mt-0 flex-1">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Staff</h1>
        <Button
          className="bg-blue-300 text-white"
          onClick={openCreateModal}
          disabled={currentUserRole !== "admin"}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* GRID */}
      {loading ? (
        <div className="h-[520px] flex items-center justify-center text-gray-500">
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
