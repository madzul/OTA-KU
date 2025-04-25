import type { UploadApiResponse } from "cloudinary";
import { v4 as uuid } from "uuid";

import cloudinary from "./cloudinary.js";

export async function uploadPdfToCloudinary(
  file: File,
): Promise<UploadApiResponse> {
  const fileUuid = uuid();
  const uuidFile = `${fileUuid}.pdf`;

  const fileBuffer = await file.arrayBuffer();
  const fileBase64 = Buffer.from(fileBuffer).toString("base64");
  const base64DataUri = `data:application/pdf;base64,${fileBase64}`;

  const result = await cloudinary.uploader.upload(base64DataUri, {
    folder: "profile",
    public_id: uuidFile,
    resource_type: "raw",
  });

  return result;
}
