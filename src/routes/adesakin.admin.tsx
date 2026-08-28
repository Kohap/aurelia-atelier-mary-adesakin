import { createFileRoute } from "@tanstack/react-router";
import { StudioDesk } from "@/components/studio-desk";

export const Route = createFileRoute("/adesakin/admin")({
  component: StudioDeskPage,
  head: () => ({
    meta: [
      { title: "Studio desk — Arteli" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function StudioDeskPage() {
  return <StudioDesk />;
}
