import interactionWorker, { LiveSession } from "../workers/clinical-ai-live/src/index";

export { LiveSession };

const PUBLIC_API_PREFIX = "/clinical-ai-0814/api";
const LEGACY_OONI_EN_PATH = "/blog/2026/0813-10x9em/";
const CANONICAL_OONI_PATH = "/blog/2026/0813-16xy2v/";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === LEGACY_OONI_EN_PATH || url.pathname === LEGACY_OONI_EN_PATH.slice(0, -1)) {
      const target = new URL(CANONICAL_OONI_PATH, url);
      target.searchParams.set("lang", "en");
      return Response.redirect(target, 301);
    }
    if (!url.pathname.startsWith(`${PUBLIC_API_PREFIX}/`)) {
      return env.ASSETS.fetch(request);
    }

    try {
      url.pathname = url.pathname.slice("/clinical-ai-0814".length);
      return await interactionWorker.fetch(new Request(url, request), env);
    } catch (error) {
      console.error(
        JSON.stringify({
          message: "clinical AI interaction proxy failed",
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      return Response.json({ error: "interaction service unavailable" }, { status: 502 });
    }
  },
} satisfies ExportedHandler<Env>;
