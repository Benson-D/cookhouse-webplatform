"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import type { ScanResult } from "../types";

function errorMessage(error: unknown): string | null {
  return error instanceof Error ? error.message : null;
}

/**
 * Presigns, uploads and scans a receipt photo in one call — mirrors
 * `useRecipeImages`'s `uploadOne`, except there's no existing entity for
 * `createUpload` to check permission against yet (a `Receipt` doesn't exist
 * until `scan` creates one).
 */
export function useReceiptScan() {
  const createUpload = trpc.receipts.createUpload.useMutation();
  const scanMutation = trpc.receipts.scan.useMutation();
  const [scanError, setScanError] = useState<string | null>(null);

  async function scan(file: File): Promise<ScanResult | null> {
    setScanError(null);
    try {
      const { storageKey, uploadUrl } = await createUpload.mutateAsync({
        contentType: file.type,
        contentLength: file.size,
      });

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!response.ok) {
        throw new Error(`Upload failed (${response.status})`);
      }

      return await scanMutation.mutateAsync({ storageKey });
    } catch (error) {
      setScanError(errorMessage(error) ?? "Couldn't scan that receipt");
      return null;
    }
  }

  return {
    scan,
    isScanning: createUpload.isPending || scanMutation.isPending,
    scanError,
  };
}
