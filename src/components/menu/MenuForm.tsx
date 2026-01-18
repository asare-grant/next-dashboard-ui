"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export interface MenuFormData {
  name: string;
  category: string;
  description: string;
  price: number;
  packs: { type: string; price: number }[];
  drinks: { name: string; price: number }[];
  allowedCustomizations: string[];
  imageFile?: File;
}

interface Props {
  initialData?: any;
  categories: string[];
  onSubmit: (data: MenuFormData) => void;
  onCancel: () => void;
}

export default function MenuForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<MenuFormData>({
    name: "",
    category: "",
    description: "",
    price: 0,
    packs: [],
    drinks: [],
    allowedCustomizations: [],
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    if (!initialData) return;

    setForm({
      name: initialData.name,
      category: initialData.category,
      description: initialData.description,
      price: initialData.price,
      packs: initialData.packs ?? [],
      drinks: initialData.drinks ?? [],
      allowedCustomizations: initialData.allowedCustomizations ?? [],
    });

    if (initialData.image) {
      setPreview(initialData.image);
    }
  }, [initialData]);

  const update = (key: keyof MenuFormData, value: any) =>
    setForm((p) => ({ ...p, [key]: value }));

  /* ---------------- IMAGE ---------------- */
  const handleImageChange = (file: File) => {
    update("imageFile", file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- PACKS / DRINKS ---------------- */
  const addPack = () =>
    update("packs", [...form.packs, { type: "", price: 0 }]);

  const addDrink = () =>
    update("drinks", [...form.drinks, { name: "", price: 0 }]);

  /* ---------------- SUBMIT ---------------- */
  const submit = () => {
    if (loading) return; // ⛔ Prevent double clicks

    try {
      setLoading(true);
      if (!form.name || !form.category) {
        setError("Name and category are required");
        setLoading(false);
        return;
      }
      onSubmit(form);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const removePack = (index: number) => {
    update(
      "packs",
      form.packs.filter((_, i) => i !== index)
    );
  };

  const removeDrink = (index: number) => {
    update(
      "drinks",
      form.drinks.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      {/* IMAGE */}
      <div>
        <Label>Image</Label>
        <div className="flex gap-4 mt-2 items-center">
          <div className="w-20 h-20 border rounded-lg overflow-hidden bg-gray-50">
            {preview ? (
              <Image src={preview} alt="Preview" width={80} height={80} />
            ) : (
              <span className="text-xs text-muted-foreground flex items-center justify-center h-full">
                No Image
              </span>
            )}
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageChange(e.target.files[0])
            }
          />
        </div>
      </div>

      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </div>

      <div>
        <Label>Category</Label>
        <select
          className="w-full border rounded-md h-9 px-2"
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <Label>Price (₵)</Label>
        <Input
          type="number"
          value={form.price}
          onChange={(e) => update("price", Number(e.target.value))}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      {/* PACKS */}
      <div>
        <Label>Packs</Label>
        {form.packs.map((p, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <Input
              placeholder="Type"
              value={p.type}
              onChange={(e) => {
                const packs = [...form.packs];
                packs[i].type = e.target.value;
                update("packs", packs);
              }}
            />
            <Input
              type="number"
              placeholder="Price"
              value={p.price}
              onChange={(e) => {
                const packs = [...form.packs];
                packs[i].price = Number(e.target.value);
                update("packs", packs);
              }}
            />

            {/* REMOVE */}
            <button
              type="button"
              onClick={() => removePack(i)}
              className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-400 transition"
              title="Remove pack"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addPack} className="mt-2">
          + Add Pack
        </Button>
      </div>

      {/* DRINKS */}
      <div>
        <Label>Drinks</Label>
        {form.drinks.map((d, i) => (
          <div key={i} className="flex gap-2 mt-2">
            <Input
              placeholder="Name"
              value={d.name}
              onChange={(e) => {
                const drinks = [...form.drinks];
                drinks[i].name = e.target.value;
                update("drinks", drinks);
              }}
            />
            <Input
              type="number"
              placeholder="Price"
              value={d.price}
              onChange={(e) => {
                const drinks = [...form.drinks];
                drinks[i].price = Number(e.target.value);
                update("drinks", drinks);
              }}
            />

            {/* REMOVE */}
            <button
              type="button"
              onClick={() => removeDrink(i)}
              className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-400 transition"
              title="Remove drink"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addDrink} className="mt-2">
          + Add Drink
        </Button>
      </div>

      <div>
        <Label>Customizations (comma separated)</Label>
        <Input
          value={form.allowedCustomizations.join(", ")}
          onChange={(e) =>
            update(
              "allowedCustomizations",
              e.target.value.split(",").map((v) => v.trim())
            )
          }
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onCancel}
          className="bg-red-300"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={submit}
          className="w-[150] rounded-lg py-2 flex items-center justify-center gap-2 bg-blue-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              {/* Spinner */}
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving</span>
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
}
