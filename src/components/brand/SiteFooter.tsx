import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { COURSES } from "@/content/courses";

export function SiteFooter() {
  return (
    <footer className="bg-gradient-navy text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Map Your Skills, Scale Your Business. Training and mentorship for
              virtual assistants who want to be globally competitive.
            </p>
          </div>

          <FooterColumn title="Route map">
            <FooterLink to="/courses">Waypoint 1 · Learn the skill</FooterLink>
            <FooterLink to="/accelerator">Waypoint 2 · Position yourself</FooterLink>
            <FooterLink to="/courses" hash="sustain">
              Waypoint 3 · Sustain the business
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Courses">
            {COURSES.slice(0, 4).map((course) => (
              <Link
                key={course.slug}
                to="/syllabus/$courseSlug"
                params={{ courseSlug: course.slug }}
                className="text-sm text-primary-foreground/75 transition-colors hover:text-accent"
              >
                {course.title}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="School">
            <FooterLink to="/about">About &amp; our why</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/portal">Student portal</FooterLink>
            <FooterLink to="/apply">Apply</FooterLink>
          </FooterColumn>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} The VApreneurs School. All rights reserved.</p>
          <p className="eyebrow text-accent">Map your skills, scale your business</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-accent">{title}</p>
      <div className="mt-4 flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({
  children,
  ...props
}: React.ComponentProps<typeof Link> & { children: React.ReactNode }) {
  return (
    <Link
      {...props}
      className="text-sm text-primary-foreground/75 transition-colors hover:text-accent"
    >
      {children}
    </Link>
  );
}
