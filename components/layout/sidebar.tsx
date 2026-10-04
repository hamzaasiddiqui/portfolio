import { SidebarProvider } from "@/components/layout/sidebar-context";
import { SidebarPanel } from "@/components/layout/sidebar-panel";
import { type NavItem } from "@/components/layout/nav-items";

export function Sidebar({
  name,
  resumeUrl,
  navItems,
}: {
  name: string;
  resumeUrl: string | null;
  navItems: NavItem[];
}) {
  return (
    <SidebarProvider>
      <SidebarPanel name={name} resumeUrl={resumeUrl} navItems={navItems} />
    </SidebarProvider>
  );
}
