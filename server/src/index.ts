import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import ExpiryMap from 'expiry-map';
import {
  fetchGithubTrending as _fetchGithubTrending,
  type Options as FetchGithubTrendingOptions,
  type ProgramLanguage,
  type SpokenLanguage,
} from 'fetch-github-trending';
import pMemoize from 'p-memoize';
import { z } from 'zod';

import { publicProcedure, router } from './trpc';

const cache = new ExpiryMap(1000 * 60 * 5);
const fetchGithubTrending = pMemoize(_fetchGithubTrending, {
  cache,
  cacheKey: (args) => JSON.stringify(args),
});

const appRouter = router({
  githubTrending: publicProcedure
    .input(
      z
        .object({
          spokenLanguage: z.string().optional(),
          programLanguage: z.union([z.string(), z.array(z.string())]).optional(),
          dateRange: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      return fetchGithubTrending({
        spokenLanguage: input?.spokenLanguage as SpokenLanguage | undefined,
        programLanguage: input?.programLanguage as ProgramLanguage | undefined,
        dateRange: input?.dateRange as FetchGithubTrendingOptions['dateRange'] | undefined,
      });
    }),
});

const server = createHTTPServer({
  middleware: cors({
    maxAge: 60 * 5,
  }),
  router: appRouter,
});

const port = 8000;
server.listen(port);
console.log(`TRPC Server running at http://localhost:${port}`);

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
