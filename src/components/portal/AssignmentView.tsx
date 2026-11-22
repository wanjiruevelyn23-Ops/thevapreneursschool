import type { ModuleAssignment } from "@/content/types";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/brand/Section";

export function AssignmentView({ assignment, unit, number, children }: { assignment: ModuleAssignment; unit: string; number: number; children?: ReactNode }) {
 return <><Eyebrow>{unit} {number} assignment</Eyebrow>
              <h2 className="mt-3 text-xl text-primary">{assignment.title}</h2>
              {assignment.intro ? (
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/85">
                  {assignment.intro}
                </p>
              ) : null}
              <ol className="mt-5 list-decimal space-y-2 pl-6 text-[0.9375rem] text-foreground/85">
                {assignment.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ol>
              {assignment.deliverable ? (
                <div className="mt-6 rounded-xl border border-accent/30 bg-mint/70 p-5">
                  <p className="eyebrow text-accent-deep">What to hand in</p>
                  <p className="mt-2 text-sm leading-relaxed text-primary">
                    {assignment.deliverable}
                  </p>
                </div>
              ) : null}
              {assignment.criteria?.length ? (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="eyebrow text-accent-deep">How it's marked</p>
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-foreground/85">
                    {assignment.criteria.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
{children}</>;
}
