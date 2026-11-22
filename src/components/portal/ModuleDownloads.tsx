import { FileDown } from "lucide-react";
import { toast } from "sonner";
import type { ModuleResource } from "@/content/types";
import { getModuleFileUrl, formatFileSize } from "@/lib/content-overrides";
import { Button } from "@/components/ui/button";

export function ModuleDownloads({ resources, title = "Downloads" }: { resources: ModuleResource[]; title?: string }) {
  if (resources.length === 0) return null;

  async function open(resource: ModuleResource) {
    const url = await getModuleFileUrl(resource.path);
    if (!url) {
      toast.error("That file couldn't be opened. Please try again.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {resources.map((resource) => (
          <li key={resource.path}>
            <Button
              variant="outline"
              type="button"
              onClick={() => void open(resource)}
              className="flex h-auto w-full items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-primary transition-colors hover:border-accent"
            >
              <FileDown className="h-4 w-4 shrink-0 text-accent" />
              <span className="min-w-0 flex-1 whitespace-normal break-words">{resource.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatFileSize(resource.size)}
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
