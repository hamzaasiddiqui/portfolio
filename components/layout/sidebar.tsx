import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { SidebarPanel } from "@/components/layout/sidebar-panel";

export function Sidebar({
  name,
  resumeUrl,
  children,
}: {
  name: string;
  resumeUrl: string | null;
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarPanel name={name} resumeUrl={resumeUrl}>
        {children}
      </SidebarPanel>
    </SidebarProvider>
  );
}
