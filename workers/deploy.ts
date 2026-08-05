/**
 * Worker deploy entry — used by `wrangler deploy` in CI.
 *
 * This file is functionally identical to workers/app.ts but imports the
 * React Router server build from the pre-compiled dist/server/index.js
 * instead of the Vite virtual module `virtual:react-router/server-build`.
 *
 * Why: wrangler uses esbuild for bundling, which cannot resolve Vite-only
 * virtual modules. This file lets esbuild find the real file on disk.
 */
import { createRequestHandler } from "react-router";
import * as build from "../dist/server/index.js";

const requestHandler = createRequestHandler(build, "production");

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
