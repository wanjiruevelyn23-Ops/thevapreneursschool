import { createFileRoute } from "@tanstack/react-router";
import { COURSES } from "@/content/courses";

const PATHS = ["/", "/courses", "/accelerator", "/about", "/contact", "/apply", "/waiting-list"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const url = new URL(request.url);
        const host = request.headers.get("x-forwarded-host") ?? url.host;
        const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
        const origin = `${proto}://${host}`;

        const urls = [...PATHS, ...COURSES.map((c) => `/syllabus/${c.slug}`)];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((p) => `  <url><loc>${origin}${p === "/" ? "/" : p}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
