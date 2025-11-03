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

  const handleDuplicateProject = async (project: Project) => {};

  const handleEditClick = async (project: Project) => {};

  const copyProjectUrl = async (id: string) => {};

  const handleDeleteClick = async (project: Project) => {};

  return (
    <>
      <div className={"border rounded-lg overflow-hidden"}>
        <Table>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Template</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>User</TableHead>

            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className={"flex flex-col"}>
                      <Link
                        href={`/playground/${project.id}`}
                        className={"hover:underline"}
                      >
                        <span className={"font-semibold"}>{project.id}</span>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(project.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className={"flex items-center gap-2"}>
                      <div className={"size-8 rounded-full overflow-hidden"}>
                        <Image
                          src={project.user.image || "/placeholder.svg"}
                          alt={project.user.name}
                        />
                      </div>
                      <span className={"text-sm"}>{project.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          {/*<MarkedToggleButton*/}
                          {/*  markedForRevision={project.starMark[0]?.isMarked}*/}
                          {/*  id={project.id}*/}
                          {/*/>*/}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Open Project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/playground/${project.id}`}
                            target="_blank"
                            className="flex items-center"
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
          </TableRow>
        </Table>
      </div>
    </>
  );
}
