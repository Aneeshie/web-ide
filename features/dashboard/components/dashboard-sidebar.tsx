"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Code2,
  Code2Icon,
  CompassIcon,
  Database,
  FlameIcon,
  FolderPlus,
  History,
  HomeIcon,
  LayoutDashboard,
  LucideIcon,
  Plus,
  Settings,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface PlaygroundDataProps {
  id: string;
  name: string;
  icon: string;
  starred: boolean;
}

const icons: Record<string, LucideIcon> = {
  Zap: Zap,
  Code: Code2,
  Terminal: Terminal,
  Compass: CompassIcon,
  Database: Database,
  FlameIcon: FlameIcon,
};

const DashboardSidebar = ({
  initialPlaygroundData,
}: {
  initialPlaygroundData: PlaygroundDataProps[];
}) => {
  const pathname = usePathname();
  const [starredPlaygrounds, setStarredPlaygrounds] = useState(
    initialPlaygroundData.filter((p) => p.starred)
  );
  const [recentPlaygrounds, setRecentPlaygrounds] = useState(
    initialPlaygroundData
  );

  return (
    <Sidebar variant="inset" collapsible="icon" className="border border-r">
      <SidebarHeader className="flex items-center gap-2 px-4 py-3 justify-center">
        <Code2Icon height={50} width={50} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/"}
                tooltip={"home"}
              >
                <Link href={"/"}>
                  <HomeIcon className="size-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/dashboard"}
                tooltip={"dashboard"}
              >
                <Link href={"#"}>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <Star className="size-4 mr-2" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupAction title="Add Starred Playground">
            <Plus className="size-4" />
          </SidebarGroupAction>

          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 &&
              recentPlaygrounds.length === 0 ? (
                <div className="text-center text-muted-foreground py-4 w-full">
                  Create Your Playground!
                </div>
              ) : (
                starredPlaygrounds.map((pg) => {
                  const IconComponent = icons[pg.icon] || Code2;
                  return (
                    <SidebarMenuItem key={pg.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/playground/${pg.id}`}
                        tooltip={pg.name}
                      >
                        <Link href={`/playground/${pg.id}`}>
                          {IconComponent && (
                            <IconComponent className="size-4" />
                          )}
                          <span>{pg.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <History className="h-4 w-4 mr-2" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupAction title="Create new playground">
            <FolderPlus className="h-4 w-4" />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {starredPlaygrounds.length === 0 && recentPlaygrounds.length === 0
                ? null
                : recentPlaygrounds.map((playground) => {
                    const IconComponent = icons[playground.icon] || Code2;
                    return (
                      <SidebarMenuItem key={playground.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/playground/${playground.id}`}
                          tooltip={playground.name}
                        >
                          <Link href={`/playground/${playground.id}`}>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span>{playground.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View all">
                  <Link href="/playgrounds">
                    <span className="text-sm text-muted-foreground">
                      View all playgrounds
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"settings"}>
              <Link href={"/settings"}>
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
