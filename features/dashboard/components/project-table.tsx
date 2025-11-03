"use client";

import { Project } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ProjectTableProps {
  projects: Project[];
  onDeleteProject?: Function;
  onUpdateProject?: Function;
  onDuplicateProject?: Function;
}

interface EditProjectData {
  title: string;
  description: string;
}

export default function ProjectTable({
  projects,
  onUpdateProject,
  onDuplicateProject,
  onDeleteProject,
}: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const templateStyles: Record<string, string> = {
    REACTJS: "bg-[#61dafb] text-black",
    NEXTJS: "bg-black text-white",
    EXPRESSJS: "bg-gray-800 text-white",
    VUE: "bg-[#42b883] text-black",
    HONO: "bg-orange-500 text-white",
    ANGULAR: "bg-red-600 text-white",
  };

  const handleDuplicateProject = async (project: Project) => {};

  const handleEditClick = async (project: Project) => {};

  const copyProjectUrl = async (id: string) => {};

  const handleDeleteClick = async (project: Project) => {};

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block border rounded-xl overflow-hidden shadow-sm bg-card">
        <Table>
          <thead className="bg-muted/50">
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-semibold py-4">Project</TableHead>
              <TableHead className="font-semibold">Template</TableHead>
              <TableHead className="font-semibold">Created</TableHead>
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </thead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="py-5">
                  <div className="flex flex-col gap-1.5">
                    <Link
                      href={`/playground/${project.id}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      <span className="font-semibold text-base">
                        {project.title || "Untitled"}
                      </span>
                    </Link>
                    <span className="text-xs text-muted-foreground font-mono">
                      {project.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-5">
                  <span
                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${
                      templateStyles[(project as any).template] ||
                      "bg-muted text-foreground"
                    }`}
                  >
                    {project.template || "-"}
                  </span>
                </TableCell>
                <TableCell className="py-5 text-sm text-muted-foreground">
                  {(() => {
                    try {
                      const d = new Date((project as any).createdAt);
                      return isNaN(d.getTime())
                        ? "-"
                        : format(d, "MMM d, yyyy");
                    } catch (_) {
                      return "-";
                    }
                  })()}
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                      <Image
                        src={
                          (project.user && project.user.image) ||
                          "/placeholder.svg"
                        }
                        alt={(project.user && project.user.name) || "User"}
                        height={36}
                        width={36}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {(project.user && project.user.name) || "Unknown"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-5 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          className="flex items-center cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          target="_blank"
                          className="flex items-center cursor-pointer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateProject(project)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyProjectUrl(project.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile/Tablet View - Card Layout */}
      <div className="lg:hidden space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-xl p-5 bg-card shadow-sm hover:shadow-md transition-all"
          >
            {/* Header with title and actions */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/playground/${project.id}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg truncate">
                    {project.title || "Untitled"}
                  </h3>
                </Link>
                <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                  {project.id}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/playground/${project.id}`}
                      className="flex items-center cursor-pointer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Open Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/playground/${project.id}`}
                      target="_blank"
                      className="flex items-center cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditClick(project)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDuplicateProject(project)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                    <Download className="h-4 w-4 mr-2" />
                    Copy URL
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDeleteClick(project)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Template Badge */}
            <div className="mb-4">
              <span
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${
                  templateStyles[(project as any).template] ||
                  "bg-muted text-foreground"
                }`}
              >
                {project.template || "-"}
              </span>
            </div>

            {/* User and Date Info */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                  <Image
                    src={
                      (project.user && project.user.image) || "/placeholder.svg"
                    }
                    alt={(project.user && project.user.name) || "User"}
                    height={32}
                    width={32}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium">
                  {(project.user && project.user.name) || "Unknown"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {(() => {
                  try {
                    const d = new Date((project as any).createdAt);
                    return isNaN(d.getTime()) ? "-" : format(d, "MMM d, yyyy");
                  } catch (_) {
                    return "-";
                  }
                })()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
