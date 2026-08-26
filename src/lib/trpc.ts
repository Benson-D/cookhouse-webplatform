import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@cookhouse/api-contract";

export const trpc = createTRPCReact<AppRouter>();
