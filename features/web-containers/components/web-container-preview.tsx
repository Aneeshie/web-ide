"use client";

import React, { useEffect, useState, useRef } from "react";
import type { TemplateFolder } from "@/features/playground/lib/path-to-json";
import { transformToWebContainerFormat } from "../hooks/transformer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import TerminalComponent from "./terminal";
import { WebContainer } from "@webcontainer/api";

interface WebContainerPreviewProps {
  templateData: TemplateFolder;
  serverUrl: string;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  forceResetup?: boolean; // Optional prop to force re-setup
}

const WebContainerPreview: React.FC<WebContainerPreviewProps> = ({
  templateData,
  error,
  instance,
  isLoading,
  serverUrl,
  writeFileSync,
  forceResetup = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  // Persist the preview URL to survive component remounts and missed events
  const storageKey = "webcontainer_preview_url";
  const [loadingState, setLoadingState] = useState({
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
    ready: false,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);
  const lastTemplateDataRef = useRef<TemplateFolder | null>(null);

  // Ref to access terminal methods
  const terminalRef = useRef<any>(null);

  // Reset setup state when forceResetup changes
  useEffect(() => {
    if (forceResetup) {
      setIsSetupComplete(false);
      setIsSetupInProgress(false);
      setPreviewUrl("");
      setCurrentStep(0);
      setLoadingState({
        transforming: false,
        mounting: false,
        installing: false,
        starting: false,
        ready: false,
      });
    }
  }, [forceResetup]);

  useEffect(() => {
    async function setupContainer() {
      // Don't run setup if it's already complete or in progress
      if (!instance || isSetupComplete || isSetupInProgress) return;

      try {
        setIsSetupInProgress(true);
        setSetupError(null);
        try {
          window.localStorage.removeItem(storageKey);
        } catch {}

        const startServer = async (pkgJsonRaw: string) => {
          const pkg = JSON.parse(pkgJsonRaw || "{}");
          const scripts = pkg?.scripts || {};
          const hasDev = Boolean(scripts.dev);
          const hasStart = Boolean(scripts.start);

          // If no dev but has start, some frameworks require a build first
          if (!hasDev && hasStart && scripts.build) {
            if (terminalRef.current?.writeToTerminal) {
              terminalRef.current.writeToTerminal("Building project...\\r\\n");
            }
            const buildProcess = await instance.spawn("npm", ["run", "build"]);
            buildProcess.output.pipeTo(
              new WritableStream({
                write(data) {
                  if (terminalRef.current?.writeToTerminal) {
                    terminalRef.current.writeToTerminal(data);
                  }
                },
              })
            );
            const buildExit = await buildProcess.exit;
            if (buildExit !== 0) {
              throw new Error(`Build failed with exit code ${buildExit}`);
            }
          }

          const startArgs = hasDev
            ? ["run", "dev"]
            : hasStart
            ? ["run", "start"]
            : null;

          if (!startArgs) {
            throw new Error(
              "No start or dev script found in package.json. Add a 'dev' or 'start' script."
            );
          }

          if (terminalRef.current?.writeToTerminal) {
            terminalRef.current.writeToTerminal(
              `Starting development server with: npm ${startArgs.join(
                " "
              )}...\\r\\n`
            );
          }

          const startProcess = await instance.spawn("npm", startArgs);

          // Stream output to terminal
          startProcess.output.pipeTo(
            new WritableStream({
              write(data) {
                if (terminalRef.current?.writeToTerminal) {
                  terminalRef.current.writeToTerminal(data);
                }
              },
            })
          );

          // Intentionally do not await exit; dev servers usually run indefinitely
        };

        // Always perform a fresh setup (no reconnect path)

        // Step 1: Transform data
        setLoadingState((prev) => ({ ...prev, transforming: true }));
        setCurrentStep(1);

        // Write to terminal
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            "🔄 Transforming template data...\\r\\n"
          );
        }

        const files = transformToWebContainerFormat(templateData);

        setLoadingState((prev) => ({
          ...prev,
          transforming: false,
          mounting: true,
        }));
        setCurrentStep(2);

        // Step 2: Mount files
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            "📁 Mounting files to WebContainer...\\r\\n"
          );
        }

        await instance.mount(files);

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            "✅ Files mounted successfully\\r\\n"
          );
        }

        setLoadingState((prev) => ({
          ...prev,
          mounting: false,
          installing: true,
        }));
        setCurrentStep(3);

        // Step 3: Install dependencies (fresh install)
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            "📦 Installing dependencies...\\r\\n"
          );
        }

        // Clean node_modules and lockfile to ensure fresh install, but keep files
        try {
          const cleanProcess = await instance.spawn("bash", [
            "-lc",
            "rm -rf node_modules package-lock.json 2>/dev/null || true",
          ]);
          await cleanProcess.exit;
        } catch {}

        const installProcess = await instance.spawn("npm", ["install"]);

        // Stream install output to terminal
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              // Write directly to terminal
              if (terminalRef.current?.writeToTerminal) {
                terminalRef.current.writeToTerminal(data);
              }
            },
          })
        );

        const installExitCode = await installProcess.exit;

        if (installExitCode !== 0) {
          throw new Error(
            `Failed to install dependencies. Exit code: ${installExitCode}`
          );
        }

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            " Dependencies installed successfully\\r\\n"
          );
        }

        setLoadingState((prev) => ({
          ...prev,
          installing: false,
          starting: true,
        }));
        setCurrentStep(4);

        // Step 4: Start the server
        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(
            "Starting development server...\\r\\n"
          );
        }

        // Read package.json from the mounted FS to decide command
        const packageJsonAfterMount = await instance.fs.readFile(
          "package.json",
          "utf8"
        );
        await startServer(packageJsonAfterMount);
      } catch (err) {
        console.error("Error setting up container:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);

        if (terminalRef.current?.writeToTerminal) {
          terminalRef.current.writeToTerminal(` Error: ${errorMessage}\\r\\n`);
        }

        setSetupError(errorMessage);
        setIsSetupInProgress(false);
        setLoadingState({
          transforming: false,
          mounting: false,
          installing: false,
          starting: false,
          ready: false,
        });
      }
    }

    setupContainer();
  }, [instance, templateData, isSetupComplete, isSetupInProgress]);

  // Detect template data changes and refresh preview
  useEffect(() => {
    // Deep check if templateData changed (files/content modified)
    const currentJson = JSON.stringify(templateData);
    const lastJson = JSON.stringify(lastTemplateDataRef.current);
    
    if (lastJson && currentJson !== lastJson && previewUrl) {
      console.log("[Preview] Template data changed, refreshing iframe");
      // Force iframe refresh with cache bust
      const newUrl = previewUrl.split("?")[0]; // Remove old timestamp
      const bust = `${newUrl}${newUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setPreviewUrl(bust);
    }
    lastTemplateDataRef.current = templateData;
  }, [templateData, previewUrl]);

  // Global listener to refresh preview when ANY server starts (including manual restarts from terminal)
  useEffect(() => {
    if (!instance) return;
    
    const handleServerReady = (port: number, url: string) => {
      console.log("[Preview] Server ready on port", port, "at", url);
      try {
        window.localStorage.setItem(storageKey, url);
      } catch {}
      // Force iframe reload with cache bust
      const bust = `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`;
      setPreviewUrl(bust);
      setLoadingState((prev) => ({
        ...prev,
        starting: false,
        ready: true,
      }));
      setIsSetupComplete(true);
      setIsSetupInProgress(false);
      if (terminalRef.current?.writeToTerminal) {
        terminalRef.current.writeToTerminal(` Preview updated at ${url}\r\n`);
      }
    };
    
    // Attach listener for server-ready events
    instance.on("server-ready", handleServerReady);
    console.log("[Preview] Attached server-ready listener");
    
    return () => {
      // Note: WebContainer's event emitter may not support removal,
      // but we clean up properly if it does
      try {
        // @ts-ignore
        if (instance.off) {
          instance.off("server-ready", handleServerReady);
        }
      } catch (e) {
        console.log("[Preview] Could not remove listener (expected)", e);
      }
    };
  }, [instance]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6 rounded-lg bg-gray-50 dark:bg-gray-900">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <h3 className="text-lg font-medium">Initializing WebContainer</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Setting up the environment for your project...
          </p>
        </div>
      </div>
    );
  }

  if (error || setupError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="h-5 w-5" />
            <h3 className="font-semibold">Error</h3>
          </div>
          <p className="text-sm">{error || setupError}</p>
        </div>
      </div>
    );
  }

  const getStepIcon = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (stepIndex === currentStep) {
      return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    } else {
      return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span
        className={`text-sm font-medium ${
          isComplete
            ? "text-green-600"
            : isActive
            ? "text-blue-600"
            : "text-gray-500"
        }`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="h-full w-full flex flex-col">
      {!previewUrl ? (
        <div className="h-full flex flex-col">
          <div className="w-full max-w-md p-6 m-5 rounded-lg bg-white dark:bg-zinc-800 shadow-sm mx-auto">
            <Progress
              value={(currentStep / totalSteps) * 100}
              className="h-2 mb-6"
            />

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                {getStepIcon(1)}
                {getStepText(1, "Transforming template data")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(2)}
                {getStepText(2, "Mounting files")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(3)}
                {getStepText(3, "Installing dependencies")}
              </div>
              <div className="flex items-center gap-3">
                {getStepIcon(4)}
                {getStepText(4, "Starting development server")}
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="flex-1 p-4">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Preview */}
          <div className="flex-1">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              title="WebContainer Preview"
            />
          </div>

          {/* Terminal at bottom when preview is ready */}
          <div className="h-64 border-t">
            <TerminalComponent
              ref={terminalRef}
              webContainerInstance={instance}
              theme="dark"
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WebContainerPreview;
