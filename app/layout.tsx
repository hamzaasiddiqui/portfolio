import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
        jetbrainsMono.variable,
        outfit.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Blocking, pre-hydration: mirrors the sidebar's collapsed
            preference from localStorage onto <html> so layout (sidebar
            width, content padding, copyright position — see globals.css)
            is correct on first paint instead of reflowing after mount. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('sidebar-collapsed')==='true'){document.documentElement.setAttribute('data-sidebar-collapsed','true')}}catch(e){}`,
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-(--z-modal) focus-visible:bg-foreground focus-visible:px-4 focus-visible:py-2 focus-visible:text-background focus-visible:outline-none"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
