import { NAV_ITEMS } from "@/components/layout/nav-items";

export function SidebarNav() {
  return (
    <nav aria-label="Section navigation" className="w-full">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className="block truncate rounded-xl px-3 py-2.5 font-sans text-body font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
