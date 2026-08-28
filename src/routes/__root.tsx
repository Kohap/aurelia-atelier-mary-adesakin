import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteShell } from "@/components/site-shell";
import { useT } from "@/lib/use-t";
import appCss from "../styles.css?url";

const APP_NAME = "Arteli";

const THEME_BOOT = `(function(){try{var r=JSON.parse(localStorage.getItem("arteli-studio")||"{}");var t=r.state&&r.state.theme;if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Arteli is the Ile-Ife studio of Nigerian thread painter Adesakin Mary Damilola — original works exploring identity, memory, Yoruba heritage, womanhood, and emotional repair.",
      },
      { name: "theme-color", content: "#b44a28" },
      { name: "author", content: "Adesakin Mary Damilola" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap",
      },
    ],
    scripts: [{ children: THEME_BOOT }],
  }),
  component: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <SiteShell>
            <Outlet />
          </SiteShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <p className="kicker">404</p>
      <h1 className="display-md mt-4">{t.notFound}</h1>
      <p className="mt-4 text-muted">{t.notFoundCopy}</p>
      <a href="/" className="btn btn-primary mt-8">
        {t.returnHome}
      </a>
    </div>
  );
}
