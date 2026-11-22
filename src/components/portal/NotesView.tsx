import { FileDown } from "lucide-react";
import type { LessonBlock, ModuleNotes } from "@/content/types";
import { Button } from "@/components/ui/button";

export function LessonBody({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2
                key={index}
                className="mt-8 border-l-4 border-accent pl-4 text-2xl text-primary"
              >
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={index} className="pt-2 font-display text-lg font-semibold text-accent-deep">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={index} className="text-[0.9375rem] leading-relaxed text-foreground/85">
                {block.text}
              </p>
            );
          case "list":
            return block.ordered ? (
              <ol key={index} className="list-decimal space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="list-disc space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <div key={index} className="rounded-xl border border-accent/30 bg-mint/70 p-5">
                <p className="eyebrow text-accent-deep">{block.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-primary">{block.text}</p>
              </div>
            );
          case "quote":
            return (
              <blockquote key={index} className="border-l-2 border-accent pl-5 font-display text-lg text-primary">
                {block.text}
              </blockquote>
            );
          case "table":
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-mint/60">
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} className="px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-widest text-accent-deep">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-border">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2.5 text-foreground/85">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function blocksToDocHtml(blocks: LessonBlock[]) {
  const navy = "#0B2D48";
  const emerald = "#0F8B5F";
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2 style="font-family:Georgia,serif;color:${navy}">${block.text}</h2>`;
        case "subheading":
          return `<h3 style="font-family:Georgia,serif;color:${emerald}">${block.text}</h3>`;
        case "paragraph":
          return `<p style="font-family:Calibri,sans-serif;font-size:11pt;color:#0C1F2E">${block.text}</p>`;
        case "list": {
          const tag = block.ordered ? "ol" : "ul";
          return `<${tag} style="font-family:Calibri,sans-serif;font-size:11pt;color:#0C1F2E">${block.items
            .map((item) => `<li>${item}</li>`)
            .join("")}</${tag}>`;
        }
        case "callout":
          return `<p style="font-family:Calibri,sans-serif;font-size:11pt;background:#E4F3EC;border-left:4px solid ${emerald};padding:8pt"><b style="color:${emerald}">${block.title}:</b> ${block.text}</p>`;
        case "quote":
          return `<p style="font-family:Georgia,serif;font-style:italic;color:${navy}">${block.text}</p>`;
        case "table":
          return `<table border="1" cellpadding="6" style="border-collapse:collapse;font-family:Calibri,sans-serif;font-size:11pt"><tr>${block.headers
            .map((h) => `<th style="background:#E4F3EC;color:${navy};text-align:left">${h}</th>`)
            .join("")}</tr>${block.rows
            .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
            .join("")}</table>`;
        default:
          return "";
      }
    })
    .join("");
}

function downloadNotesDoc(title: string, fileName: string, blocks: LessonBlock[]) {
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${title}</title></head><body><h1 style="font-family:Georgia,serif;color:#0B2D48">${title}</h1>${blocksToDocHtml(blocks)}</body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}


export function NotesView({ notes }: { notes: ModuleNotes }) {
  return (
            <div className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-lg font-semibold text-primary">
                  {notes.title}
                </p>
                <Button
                  size="sm"
                  variant="softMint"
                  onClick={() =>
                    notes &&
                    downloadNotesDoc(
                      notes.title,
                      notes.fileName,
                      notes.blocks,
                    )
                  }
                >
                  <FileDown className="h-4 w-4" /> Word doc
                </Button>
              </div>
              {notes.intro ? (
                <p className="mt-4 rounded-xl border-l-4 border-accent bg-mint/60 p-4 text-[0.9375rem] leading-relaxed text-primary">
                  {notes.intro}
                </p>
              ) : null}
              <div className="mt-5 border-t border-border pt-5">
                <LessonBody blocks={notes.blocks} />
              </div>
            </div>
  );
}
