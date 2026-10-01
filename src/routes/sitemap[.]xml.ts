import { createFileRoute } from "@tanstack/react-router";
import { COURSES } from "@/content/courses";

const SITE = "https://thevapreneursschool.com";
const PATHS = ["/", "/courses", "/accelerator", "/about", "/contact", "/apply", "/waiting-list"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const urls = [...PATHS, ...COURSES.map((c) => `/syllabus/${c.slug}`)];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((p) => `  <url><loc>${SITE}${p === "/" ? "/" : p}</loc></url>`)
          .join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
