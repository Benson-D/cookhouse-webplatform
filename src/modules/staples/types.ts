import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@cookhouse/api-contract";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Staple = RouterOutputs["staples"]["list"][number];
