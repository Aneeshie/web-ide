import { TemplateFolder } from "@/features/playground/lib/path-to-json";
import { WebContainer } from "@webcontainer/api";
import { useCallback, useEffect, useState } from "react";

interface UseWebContainerProps {
  templateData: TemplateFolder;
}

interface UseWebContainerReturn {
  serverUrl: string | null;
  isLoading: boolean;
  error: string | null;
  instance: WebContainer | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
  destroy: () => void;
}

export const useWebContainer = ({
  templateData,
}: UseWebContainerProps): UseWebContainerReturn => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [instance, setInstance] = useState<WebContainer | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initWebContainer() {
      try {
        const webContainerInstance = await WebContainer.boot();

        if (!mounted) return;
        setInstance(webContainerInstance);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize webcontainer: ", error);
        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to initiailize WebContainer",
          );
          setIsLoading(false);
        }
      }
    }

    initWebContainer();

    return () => {
      mounted = false;
      if (instance) {
        instance.teardown();
      }
    };
  }, []);

  const writeFileSync = useCallback(
    async (path: string, content: string): Promise<void> => {
      if (!instance) {
        throw new Error("WebContainer instance is not initialized");
      }

      try {
        const partsOfPath = path.split("/");
        const folderPath = partsOfPath.slice(0, -1).join("/");

        if (folderPath) {
          await instance.fs.mkdir(folderPath, { recursive: true });
        }

        await instance.fs.writeFile(path, content);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`Failed to write file at ${path}: `, errorMessage);
        throw new Error(`Failed to write file at ${path}: ${errorMessage}`);
      }
    },
    [instance],
  );

  const destroy = useCallback(() => {
    if (instance) {
      instance.teardown();
      setInstance(null);
      setServerUrl(null);
    }
  }, [instance]);

  return {
    destroy,
    error,
    instance,
    isLoading,
    serverUrl,
    writeFileSync,
  };
};
