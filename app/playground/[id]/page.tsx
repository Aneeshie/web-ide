"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TemplateFileTree } from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/use-file-explorer";
import { usePlayground } from "@/features/playground/hooks/use-playground";
import { Bot, Save, Settings2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const { playgroundData, templateData, isLoading, error, saveTemplateData } =
    usePlayground(id);

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  return (
    <TooltipProvider>
      <>
        {/* TODO: TEMPLATE FILE TREE  */}
        <TemplateFileTree data={templateData!} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            {/* Main header section: left - title/subtitle, right - actions */}
            <div className="flex flex-1 items-center gap-2">
              {/* Title and file info on the left */}
              <div className="flex flex-col flex-1">
                <h1 className="text-sm font-medium">
                  {playgroundData?.title || "Code Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} File(s) open
                  {hasUnsavedChanges && " -> Unsaved Changes"}
                </p>
              </div>
              {/* Buttons on the far right */}
              <div className="flex items-center gap-1 ml-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="size-4"
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="size-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Save (Ctrl + S)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="size-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl + Shift + S)</TooltipContent>
                </Tooltip>

                {/* TODO: Toggle Ai Component  */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      variant={"outline"}
                      onClick={() => {}}
                      disabled={!hasUnsavedChanges}
                    >
                      <Bot className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle AI</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"outline"}>
                      <Settings2 className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files.
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default Page;
