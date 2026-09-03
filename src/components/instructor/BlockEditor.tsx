/**
 * Plain-language editor for lesson / notes content blocks. Instructors never see
 * JSON: each block is a small card with the fields that block type needs.
 */
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { LessonBlock } from "@/content/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type BlockType = LessonBlock["type"];

const BLOCK_LABELS: { type: BlockType; label: string }[] = [
  { type: "paragraph", label: "Paragraph" },
  { type: "heading", label: "Heading" },
  { type: "subheading", label: "Sub-heading" },
  { type: "list", label: "Bullet list" },
  { type: "callout", label: "Highlight box" },
  { type: "table", label: "Table" },
  { type: "quote", label: "Quote" },
];

function emptyBlock(type: BlockType): LessonBlock {
  switch (type) {
    case "heading":
    case "subheading":
      return { type, text: "" };
    case "list":
      return { type: "list", items: [] };
    case "callout":
      return { type: "callout", title: "", text: "" };
    case "table":
      return { type: "table", headers: ["Column 1", "Column 2"], rows: [["", ""]] };
    case "quote":
      return { type: "quote", text: "" };
    default:
      return { type: "paragraph", text: "" };
  }
}

export function BlockEditor({
  blocks,
  onChange,
  label = "Content",
}: {
  blocks: LessonBlock[];
  onChange: (next: LessonBlock[]) => void;
  label?: string;
}) {
  const update = (index: number, block: LessonBlock) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    const [item] = next.splice(index, 1);
    if (item) next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="font-mono text-[11px] tracking-[0.12em] uppercase">{label}</Label>
        <div className="flex flex-wrap gap-1.5">
          {BLOCK_LABELS.map((b) => (
            <Button
              key={b.type}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onChange([...blocks, emptyBlock(b.type)])}
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              {b.label}
            </Button>
          ))}
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Nothing here yet — add a paragraph, heading or list above.
        </p>
      ) : null}

      {blocks.map((block, index) => (
        <div key={index} className="rounded-md border bg-card p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
              {BLOCK_LABELS.find((b) => b.type === block.type)?.label ?? block.type}
            </span>
            <div className="flex gap-1">
              <Button type="button" size="icon" variant="ghost" onClick={() => move(index, -1)}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button type="button" size="icon" variant="ghost" onClick={() => move(index, 1)}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => onChange(blocks.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>

          {block.type === "heading" || block.type === "subheading" ? (
            <Input
              value={block.text}
              placeholder="Heading text"
              onChange={(e) => update(index, { ...block, text: e.target.value })}
            />
          ) : null}

          {block.type === "paragraph" || block.type === "quote" ? (
            <Textarea
              rows={4}
              value={block.text}
              placeholder="Write the text here…"
              onChange={(e) => update(index, { ...block, text: e.target.value })}
            />
          ) : null}

          {block.type === "list" ? (
            <Textarea
              rows={5}
              value={block.items.join("\n")}
              placeholder="One bullet point per line"
              onChange={(e) =>
                update(index, {
                  ...block,
                  items: e.target.value.split("\n").map((l) => l.trim()).filter(Boolean),
                })
              }
            />
          ) : null}

          {block.type === "callout" ? (
            <div className="space-y-2">
              <Input
                value={block.title}
                placeholder="Box title"
                onChange={(e) => update(index, { ...block, title: e.target.value })}
              />
              <Textarea
                rows={3}
                value={block.text}
                placeholder="Box text"
                onChange={(e) => update(index, { ...block, text: e.target.value })}
              />
            </div>
          ) : null}

          {block.type === "table" ? (
            <div className="space-y-2">
              <Input
                value={block.headers.join(" | ")}
                placeholder="Column headings separated by |"
                onChange={(e) =>
                  update(index, {
                    ...block,
                    headers: e.target.value.split("|").map((h) => h.trim()),
                  })
                }
              />
              <Textarea
                rows={5}
                value={block.rows.map((r) => r.join(" | ")).join("\n")}
                placeholder="One row per line, cells separated by |"
                onChange={(e) =>
                  update(index, {
                    ...block,
                    rows: e.target.value
                      .split("\n")
                      .filter((l) => l.trim().length > 0)
                      .map((l) => l.split("|").map((c) => c.trim())),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Use the | character to separate columns.
              </p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
