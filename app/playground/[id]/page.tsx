"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingStep from "@/components/ui/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlaygroundEditor from "@/features/playground/components/playground-editor";
import { TemplateFileTree } from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/use-file-explorer";
import { usePlayground } from "@/features/playground/hooks/use-playground";
import { TemplateFile } from "@/features/playground/types";
import WebContainerPreview from "@/features/web-containers/components/web-container-preview";
import { useWebContainer } from "@/features/web-containers/hooks/use-web-container";
import {
  AlertCircle,
  Bot,
  Divide,
  FileText,
  Save,
  Settings2,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData: templateData! });

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);

  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="size-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant={"destructive"}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground...
          </h2>
          <LoadingStep
            currentStep={1}
            step={1}
            label="Fetching playground data"
          />
          <LoadingStep
            currentStep={2}
            step={2}
            label="Loading Playground data"
          />
          <LoadingStep currentStep={3} step={3} label="Ready to code" />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <>
        {/* TODO: TEMPLATE FILE TREE  */}
        <TemplateFileTree
          data={templateData!}
          onFileSelect={handleFileSelect}
          selectedFile={activeFile}
        />
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

          <div className="h-[calc(100vh-4rem)]">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="border-b bg-muted/30">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex items-center justify-between px-4 py-3">
                      <TabsList className="h-10 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="size-3" />
                              <span>
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="size-2 rounded-full bg-orange-600" />
                              )}
                              <span
                                className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {openFiles.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={closeAllFiles}
                          className="h-6 px-2 text-xs"
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>

                <div className="flex-1">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                      <PlaygroundEditor
                        activeFile={activeFile}
                        editorContent={activeFile?.content || ""}
                        onContentChange={(value) =>
                          activeFileId && updateFileContent(activeFileId, value)
                        }
                      />
                    </ResizablePanel>
                    {isPreviewVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                          <WebContainerPreview
                            templateData={templateData!}
                            instance={instance}
                            serverUrl={serverUrl!}
                            isLoading={containerLoading}
                            error={containerError}
                            writeFileSync={writeFileSync}
                            forceResetup={false}
                          />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                <FileText className="size-15 text-gray-400" />
                <div className="text-center">
                  <p className="text-lg font-medium">No Files Open.</p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default Page;
