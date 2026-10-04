"use client";

import { createContext, use, useEffect, useState, type ReactNode } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);
const STORAGE_KEY = "sidebar-collapsed";

function persist(collapsed: boolean) {
  const root = document.documentElement;
  if (collapsed) {
    root.setAttribute("data-sidebar-collapsed", "true");
  } else {
    root.removeAttribute("data-sidebar-collapsed");
  }
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch {
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-sidebar-collapsed")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    persist(isCollapsed);
  }, [isCollapsed]);

  return (
    <SidebarContext
      value={{
        isCollapsed,
        toggleCollapsed: () => setIsCollapsed((prev) => !prev),
      }}
    >
      {children}
    </SidebarContext>
  );
}

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
