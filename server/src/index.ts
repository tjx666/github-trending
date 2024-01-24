import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";
import {
  fetchGithubTrending,
  type Options as FetchGithubTrendingOptions,
  type ProgramLanguage,
  type SpokenLanguage,
} from "fetch-github-trending";
import { z } from "zod";

import { publicProcedure, router } from "./trpc";

const appRouter = router({
  githubTrending: publicProcedure
    .input(
      z
        .object({
          spokenLanguage: z.string().optional(),
          programLanguage: z
            .union([z.string(), z.array(z.string())])
            .optional(),
          dateRange: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return fetchGithubTrending({
        spokenLanguage: input?.spokenLanguage as SpokenLanguage | undefined,
        programLanguage: input?.programLanguage as ProgramLanguage | undefined,
        dateRange: input?.dateRange as
          | FetchGithubTrendingOptions["dateRange"]
          | undefined,
      });
    }),
});

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
});

const port = 8000;
server.listen(port);
console.log(`TRPC Server running at http://localhost:${port}`);

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
