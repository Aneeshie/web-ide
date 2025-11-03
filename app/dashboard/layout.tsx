import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundsByUser } from "@/features/dashboard/actions";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playgroundData = await getAllPlaygroundsByUser();

  const iconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
    VUE: "Compass",

  };

  const formattedPlayground =
    playgroundData?.map((pg) => ({
      id: pg.id,
      name: pg.title,
      starred: pg.starkMark?.[0]?.isMarked || false,
      icon: iconMap[pg.template] || "Code2",
    })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* TODO: DasboardSIdebar */}
        <DashboardSidebar initialPlaygroundData={formattedPlayground} />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
