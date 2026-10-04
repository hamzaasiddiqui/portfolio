import type { Metadata } from "next";
import { Geist, Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { IntroProvider } from "@/components/motion/intro-context";
import { RevealManager } from "@/components/motion/reveal-manager";
import { PlasmaField } from "@/components/plasma/plasma-field";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

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
            <PlasmaField>{children}</PlasmaField>
            <RevealManager />
          </IntroProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
