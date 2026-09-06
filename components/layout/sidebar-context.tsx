"use client";

import { createContext, use, useEffect, useState, type ReactNode } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);
const STORAGE_KEY = "sidebar-collapsed";

function persist(collapsed: boolean) {
  // setAttribute with an explicit "true", not toggleAttribute — the latter
  // writes an *empty* value, which never matches globals.css's
  // `:root[data-sidebar-collapsed="true"]` selector, so --sidebar-offset
  // (and therefore the panel width) silently never changed.
  const root = document.documentElement;
  if (collapsed) {
    root.setAttribute("data-sidebar-collapsed", "true");
  } else {
    root.removeAttribute("data-sidebar-collapsed");
  }
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch {
    // Private-browsing localStorage access can throw — collapse still
    // works for the session, it just won't persist across reloads.
  }
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // A blocking script in app/layout.tsx reads localStorage before hydration
  // and sets data-sidebar-collapsed on <html> so *layout* (width, padding)
  // is correct on first paint. React state still starts at `false` to match
  // the server's render exactly (avoiding a hydration mismatch on the
  // collapse-dependent JSX below — icons, resume button, truncated labels);
  // this corrects it to match moments after mount instead.
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
