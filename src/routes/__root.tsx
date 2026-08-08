import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import FloatingDock from "../components/FloatingDock";
import favicon32 from "../assets/favicon-32.webp.asset.json";
import favicon192 from "../assets/favicon-192.webp.asset.json";
import faviconApple from "../assets/apple-touch-icon.webp.asset.json";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Usman Jatoi" },
      {
        name: "description",
        content:
          "Official site of Usman Jatoi — educator, entrepreneur and strategist. Courses, blog posts, services and resources.",
      },
      { name: "author", content: "Usman Jatoi" },
      { property: "og:title", content: "Usman Jatoi" },
      {
        property: "og:description",
        content: "Official site of Usman Jatoi — educator, entrepreneur and strategist. Courses, blog posts, services and resources.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Usman Jatoi" },
      { name: "twitter:description", content: "Official site of Usman Jatoi — educator, entrepreneur and strategist. Courses, blog posts, services and resources." },
    ],
    scripts: [
      {
        children:
          "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KN9QXNG4');",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/webp", sizes: "32x32", href: favicon32.url },
      { rel: "icon", type: "image/webp", sizes: "192x192", href: favicon192.url },
      { rel: "apple-touch-icon", sizes: "180x180", href: faviconApple.url },
      { rel: "shortcut icon", href: favicon32.url },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideChrome =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/import") ||
    pathname.startsWith("/auth");

  // Floating pill dock on the top pillar pages only.
  const dockPrefixes = [
    "/services",
    "/blog",
    "/portfolio",
    "/about-me",
    "/skills-expertise",
    "/case-studies",
    "/call",
  ];
  const showDock =
    !hideChrome && dockPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <QueryClientProvider client={queryClient}>
      {!hideChrome && <SiteHeader />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      {showDock && <FloatingDock />}
      {!hideChrome && <SiteFooter />}
    </QueryClientProvider>
  );
}
