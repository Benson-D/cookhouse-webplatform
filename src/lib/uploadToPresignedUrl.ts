/**
 * PUTs a file straight to a presigned bucket URL. The backend never sees
 * this request, so this is the only place a failed upload can be caught —
 * callers should let the thrown error surface as their own upload failure.
 */
export async function uploadToPresignedUrl(uploadUrl: string, file: File): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status})`);
  }
}
