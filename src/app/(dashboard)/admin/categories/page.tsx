"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import CategoryFormModal from "@/components/categories/CategoryFormModal";
import DeleteCategoryDialog from "@/components/categories/DeleteCategoryDialog";
import { toast } from "react-toastify";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";
import { uploadCategoryImage } from "@/lib/appwrite-upload";


ModuleRegistry.registerModules([AllCommunityModule]);

/* ---------------- TYPES ---------------- */
export interface Category {
  $id: string;
  name: string;
  description: string;
  image?: string;
}

/* =========================================================
   CATEGORIES PAGE
========================================================= */
export default function CategoriesPage() {
  /* ---------------- STATE ---------------- */
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const requestDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteOpen(true);
  };

  /* ---------------- CREATE / UPDATE ---------------- */
  const handleSave = async (data: {
    name: string;
    description: string;
    imageFile?: File;
  }) => {
    try {
      let imageUrl: string | undefined = editingCategory?.image;

      /* -------- Upload image to Appwrite if provided -------- */
      if (data.imageFile instanceof File) {
        const upload = await uploadCategoryImage(data.imageFile);
        imageUrl = upload.url;
      }

      if (editingCategory) {
        const res = await updateCategory(editingCategory.$id, {
          name: data.name,
          description: data.description,
          image: imageUrl,
        });

        setCategories((prev) =>
          prev.map((c) => (c.$id === editingCategory.$id ? res.category : c))
        );

        toast.success("Category updated");
      } else {
        const res = await createCategory({
          name: data.name,
          description: data.description,
          image: imageUrl,
        });

        setCategories((prev) => [...prev, res.category]);
        toast.success("Category created");
      }

      setModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error(error);
      toast.error("Operation failed");
    }
  };

  /* ---------------- DELETE ---------------- */
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.$id);
      setCategories((prev) =>
        prev.filter((c) => c.$id !== categoryToDelete.$id)
      );
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setDeleteOpen(false);
      setCategoryToDelete(null);
    }
  };

  /* ---------------- GRID ---------------- */
  const columnDefs = useMemo<ColDef<Category>[]>(() => [
    {
      headerName: "Image",
      field: "image",
      width: 90,
      cellRenderer: (params: any) => (
        <div className="flex items-center justify-center h-full w-full">
          {params.value ? (
            <Image
              src={params.value}
              alt={params.data.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-md" />
          )}
        </div>
      ),
    },
    {
      field: "name",
      filter: true,
      sortable: true,
      flex: 1,
    },
    {
      field: "description",
      filter: true,
      flex: 2,
    },
    {
      headerName: "Actions",
      width: 140,
      cellRenderer: (params: any) => (
        <div className="row-actions flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="outline"
            className="bg-green-300"
            onClick={() => openEditModal(params.data)}
          >
            <Pencil size={16} />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="bg-red-300"
            onClick={() => requestDelete(params.data)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ], []);

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

  /* ---------------- UI STATES ---------------- */
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-gray-500">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-primary mb-4" />
      <p className="text-sm">Loading categories...</p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-[520px] text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        📂
      </div>
      <h2 className="text-lg font-semibold">No categories yet</h2>
      <p className="text-sm text-gray-500 mb-4">
        Create categories to organize your menu items.
      </p>
      <Button onClick={openCreateModal}>
        <Plus className="mr-2 h-4 w-4" />
        Add First Category
      </Button>
    </div>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <div className="bg-white rounded-xl p-4 m-4 mt-0 flex-1">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Categories</h1>
        <Button className="bg-blue-300 text-white" onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* CONTENT */}
      {loading ? (
        <LoadingState />
      ) : categories.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="ag-custom-grid w-full h-[520px] rounded-xl overflow-hidden border">
          <AgGridReact
            theme={gridTheme}
            rowData={categories}
            columnDefs={columnDefs}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            suppressCellFocus
            animateRows
            rowSelection={{ mode: "singleRow" }}
            headerHeight={55}
            rowHeight={64}
            getRowClass={() => "ag-row-hover-actions"}
          />
        </div>
      )}

      {/* MODALS */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Add Category"}
        initialData={editingCategory ?? undefined}
        onSubmit={handleSave}
      />

      <DeleteCategoryDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        categoryName={categoryToDelete?.name}
      />
    </div>
  );
}
