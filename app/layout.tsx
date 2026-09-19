import type { Metadata } from "next";
import { Geist, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { IntroProvider } from "@/components/motion/intro-context";
import { RevealManager } from "@/components/motion/reveal-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Label face for nav items, section labels, dates and tags: a wide grotesk
// with generous counters that stays open at 13px uppercase, where a
// monospace read as cramped. Loaded as a variable font so weight is free.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

// Display face for headings and the sidebar name: a geometric sans with
// near-circular bowls, flat terminals and no decorative flourishes —
// sleek and minimal rather than characterful. Body copy stays on Geist.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hamza Siddiqui",
  description: "Portfolio of Hamza Siddiqui.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        spaceGrotesk.variable,
        outfit.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Blocking, pre-hydration, so the first paint is already right:
            - mirrors the sidebar's collapsed preference from localStorage
              onto <html> (width, padding, copyright position — globals.css);
            - marks <html> as `js` so the CSS may hide `[data-reveal]`
              content until it animates in, without ever hiding it from a
              visitor with scripts off;
            - marks a repeat visit in this tab (data-intro="seen") so the
              loading screen is skipped before it can flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(d){d.classList.add('js');try{if(localStorage.getItem('sidebar-collapsed')==='true'){d.setAttribute('data-sidebar-collapsed','true')}if(sessionStorage.getItem('intro-seen')==='1'){d.setAttribute('data-intro','seen')}}catch(e){}})(document.documentElement)`,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <IntroProvider>
            <a
              href="#main-content"
              className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-(--z-modal) focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background focus-visible:outline-none"
            >
              Skip to main content
            </a>
            {children}
            {/* After the page, so every [data-reveal] element exists when
                it looks for them. */}
            <RevealManager />
          </IntroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
