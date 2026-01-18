"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type CategoryFormValues = {
  name: string;
  description: string;
  image?: string; // existing image URL
  imageFile?: File; // NEW: file for upload
};

interface Props {
  initialData?: CategoryFormValues;
  onSubmit: (data: CategoryFormValues) => void;
  onCancel: () => void;
}

export default function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [image, setImage] = useState<string | undefined>(initialData?.image);
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (loading) return; // ⛔ Prevent double clicks

    try {
      setLoading(true);
      if (!name.trim()) {
        setError("Category name is required");
        setLoading(false);
        return;
      }

      onSubmit({
        name,
        description,
        image,
        imageFile,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* IMAGE UPLOAD */}
      <div>
        <Label>Category Image</Label>
        <div className="flex items-center gap-4 mt-2">
          <div className="w-20 h-20 rounded-lg border flex items-center justify-center overflow-hidden bg-gray-50">
            {image ? (
              <Image
                src={image}
                alt="Preview"
                width={80}
                height={80}
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400">No Image</span>
            )}
          </div>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
          />
        </div>
      </div>

      {/* NAME */}
      <div>
        <Label>Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jollof"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short category description"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* ACTIONS */}
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
          onClick={handleSubmit} 
          className="w-[150] rounded-lg py-2 flex items-center justify-center gap-2 bg-blue-300 disabled:opacity-70 disabled:cursor-not-allowed">
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
