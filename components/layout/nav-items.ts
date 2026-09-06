export interface NavItem {
  label: string;
  href: string;
  icon: "user-circle" | "wrench" | "git-branch" | "briefcase" | "folder-open" | "envelope-open";
}

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about", icon: "user-circle" },
  { label: "Skills", href: "#skills", icon: "wrench" },
  { label: "Process", href: "#process", icon: "git-branch" },
  { label: "Experience", href: "#experience", icon: "briefcase" },
  { label: "Projects", href: "#projects", icon: "folder-open" },
  { label: "Connect", href: "#connect", icon: "envelope-open" },
];
