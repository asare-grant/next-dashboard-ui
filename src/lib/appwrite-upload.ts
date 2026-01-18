// import { storage, ID } from "./appwrite-client";

// const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

// export async function uploadCategoryImage(file: File) {
//   const uploaded = await storage.createFile(
//     BUCKET_ID,
//     ID.unique(),
//     file
//   );

//   const previewUrl = storage.getFilePreview(
//     BUCKET_ID,
//     uploaded.$id,
//     200,
//     200
//   );

//   return {
//     fileId: uploaded.$id,
//     url: previewUrl,
//   };
// }


import { storage } from "@/lib/appwrite-client";
import { ID } from "appwrite";

const BUCKET_ID = "692e3391000bd5915f8c";
const PROJECT_ID = "692cf3e800307147c7d6";

export const uploadCategoryImage = async (file: File) => {
  const uploaded = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    file
  );

  const url = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}`;

  return {
    fileId: uploaded.$id,
    url,
  };
};

export const uploadMenuImage = async (file: File) => {
  const uploaded = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    file
  );

  const url = `https://fra.cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}`;

  return {
    fileId: uploaded.$id,
    url,
  };
};
