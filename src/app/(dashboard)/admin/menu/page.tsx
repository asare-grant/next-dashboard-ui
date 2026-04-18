"use client";

import { useEffect, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  themeQuartz,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import Image from "next/image";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import MenuFormModal from "@/components/menu/MenuFormModal";
import DeleteMenuDialog from "@/components/menu/DeleteMenuDialog";
import { getMenus, createMenu, updateMenu, deleteMenu } from "@/lib/api/menu";
import { uploadMenuImage } from "@/lib/appwrite-upload";

ModuleRegistry.registerModules([AllCommunityModule]);

/* ---------------- TYPES ---------------- */

export interface MenuItem {
  $id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  packs: any[];
  drinks: any[];
  allowedCustomizations: string[];
}

export default function MenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);

  const categories = ["Waakye", "Jollof", "Plain Rice", "RAAJ Juice"];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);

  /* ---------------- FETCH ---------------- */

  /* ---------------- FETCH ---------------- */
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch {
      toast.error("Failed to load menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const requestDelete = (menu: MenuItem) => {
    setMenuToDelete(menu);
    setDeleteOpen(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCreateModal = () => {
    setEditingMenu(null);
    setModalOpen(true);
  };

  const openEditModal = (menu: MenuItem) => {
    setEditingMenu(menu);
    setModalOpen(true);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async (data: any) => {
    try {
      let imageUrl = editingMenu?.image;

      if (data.imageFile instanceof File) {
        const upload = await uploadMenuImage(data.imageFile);
        imageUrl = upload.url;
      }

      const payload = {
        name: data.name,
        category: data.category,
        description: data.description,
        price: data.price,
        image: imageUrl,
        packs: data.packs,
        drinks: data.drinks,
        allowedCustomizations: data.allowedCustomizations,
      };

      if (editingMenu) {
        const res = await updateMenu(editingMenu.$id, payload);
        setMenus((prev) =>
          prev.map((m) => (m.$id === editingMenu.$id ? res.menuItem : m)),
        );
        toast.success("Menu updated");
      } else {
        const res = await createMenu(payload);
        setMenus((prev) => [...prev, res.menuItem]);
        toast.success("Menu created");
      }

      setModalOpen(false);
      setEditingMenu(null);
    } catch (e) {
      console.error(e);
      toast.error("Operation failed");
    }
  };

  /* ---------------- DELETE ---------------- */

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    try {
      await deleteMenu(menuToDelete.$id);
      setMenus((prev) => prev.filter((m) => m.$id !== menuToDelete.$id));
      toast.success("Menu deleted");
    } catch {
      toast.error("Failed to delete menu");
    } finally {
      setDeleteOpen(false);
      setMenuToDelete(null);
    }
  };

  const columnDefs: ColDef<MenuItem>[] = [
    {
      headerName: "Image",
      field: "image",
      minWidth: 90,
      maxWidth: 100,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams<MenuItem, any>) => {
        const src = typeof params.value === "string" ? params.value : null;
        return (
          <div className="flex items-center justify-center h-full">
            {src ? (
              <img
                src={src}
                alt={params.data?.name ?? "menu"}
                width={44}
                height={44}
                style={{
                  width: 44,
                  height: 44,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                }}
              />
            ) : (
              <span className="text-xs text-muted-foreground">—</span>
            )}
          </div>
        );
      },
    },
    {
      headerName: "Menu Item",
      field: "name",
      minWidth: 260,
      cellRenderer: (params: ICellRendererParams<MenuItem, string>) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{params.value}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {params.data?.description ?? "—"}
          </span>
        </div>
      ),
    },
    {
      headerName: "Category",
      field: "category",
      minWidth: 100,
      filter: true,
      cellRenderer: (params: ICellRendererParams<MenuItem, string>) => (
        <span className="px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
          {params.value ?? "—"}
        </span>
      ),
    },
    {
      headerName: "Price (₵)",
      field: "price",
      minWidth: 80,
      sortable: true,
      cellRenderer: (params: ICellRendererParams<MenuItem, number>) => (
        <span className="font-semibold">₵ {params.value ?? 0}</span>
      ),
    },
    {
      headerName: "Packs",
      field: "packs",
      minWidth: 220,
      cellRenderer: (
        params: ICellRendererParams<
          MenuItem,
          { type: string; price: number }[] | undefined
        >,
      ) => {
        const packs = params.value ?? [];
        if (!packs.length)
          return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {packs.map((p) => (
              <span
                key={p.type}
                className="px-2 py-0.5 text-xs rounded-md bg-blue-100 text-blue-700 font-medium"
              >
                {p.type}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      headerName: "Customizations",
      field: "allowedCustomizations",
      minWidth: 170,
      cellRenderer: (
        params: ICellRendererParams<MenuItem, string[] | undefined>,
      ) => {
        const count = params.value?.length ?? 0;
        return (
          <span
            className={`text-sm font-medium ${
              count ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {count} item{count !== 1 ? "s" : ""}
          </span>
        );
      },
    },
    {
      headerName: "Drinks",
      field: "drinks",
      minWidth: 140,
      cellRenderer: (
        params: ICellRendererParams<
          MenuItem,
          { name: string; price: number }[] | undefined
        >,
      ) => {
        const count = params.value?.length ?? 0;
        return (
          <span className="text-sm">
            {count ? `${count} option${count > 1 ? "s" : ""}` : "—"}
          </span>
        );
      },
    },
    // {
    //   headerName: "Favs",
    //   field: "favoritesCount",
    //   minWidth: 100,
    //   cellRenderer: (params: ICellRendererParams<MenuItem, number>) => (
    //     <span className="text-sm">{params.value ?? 0}</span>
    //   ),
    // },
    {
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <div className="row-actions flex items-center gap-2 opacity-[0.5] transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className="bg-blue-200"
            onClick={() => {}}
          >
            <Eye size={16} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-green-300"
            onClick={() => openEditModal(params.data)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="bg-red-300"
            onClick={() => requestDelete(params.data)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  /* ---------------- AG GRID THEME ---------------- */
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

  return (
    <div className="bg-gray-100 rounded-xl p-4 m-4 mt-0 min-h-[600px]">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-blue-300">Menu</h1>
          <p className="text-sm text-muted-foreground">
            Manage all food and drink items
          </p>
        </div>

        <Button onClick={openCreateModal} className="bg-blue-200 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* GRID */}
      {loading ? (
        <LoadingState />
      ) : mounted ? (
        <div className="ag-custom-grid w-full h-[520px] rounded-xl overflow-hidden border">
          <AgGridReact
            theme={gridTheme}
            rowData={menus}
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
            alwaysShowHorizontalScroll
            suppressColumnVirtualisation={false}
          />
        </div>
      ) : null}
      <MenuFormModal
        open={modalOpen}
        title={editingMenu ? "Edit Menu Item" : "Add Menu Item"}
        initialData={editingMenu ?? undefined}
        categories={categories}
        onClose={() => {
          setModalOpen(false);
          setEditingMenu(null);
        }}
        onSubmit={handleSave}
      />

      <DeleteMenuDialog
        open={deleteOpen}
        menuName={menuToDelete?.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-[520px] text-muted-foreground">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary mb-4" />
    <p className="text-sm">Loading menu items...</p>
  </div>
);
