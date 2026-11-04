import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const host = request.headers.get("x-forwarded-host") ?? url.host;
        const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
        const origin = `${proto}://${host}`;

        const body = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
        return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
