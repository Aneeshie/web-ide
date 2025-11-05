import { useCallback, useEffect, useState } from "react";
import { TemplateFolder } from "../lib/path-to-json";
import { getPlaygroundById, saveUpdatedCode } from "../actions";
import { toast } from "sonner";

interface PlaygroundData {
  id: string;
  title?: string;
  [key: string]: any;
}

interface UsePlaygroundReturn {
  playgroundData: PlaygroundData | null;
  templateData: TemplateFolder | null;
  isLoading: Boolean;
  error: string | null;
  loadPlayground: () => Promise<void>;
  saveTemplateData: (data: TemplateFolder, showToast?: boolean) => Promise<void>;
}

export const usePlayground = (id: string): UsePlaygroundReturn => {
  const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(
    null
  );

  const [templateData, setTemplateData] = useState<TemplateFolder | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const loadPlayground = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const pg = await getPlaygroundById(id);

      console.log("[usePlayground] Playground data:", pg);
      //@ts-expect-error later
      setPlaygroundData(pg);
      const rawContent = pg?.templateFiles?.[0]?.content;

      console.log("[usePlayground] rawContent type:", typeof rawContent);
      console.log("[usePlayground] rawContent:", rawContent);

      // Prisma returns JSON fields as already parsed objects
      if (rawContent && typeof rawContent === "object") {
        console.log("[usePlayground] Using template from database (object)");
        setTemplateData(rawContent as TemplateFolder);
        toast.success("playground loaded successfully!");
        return;
      }

      // Fallback: Try to parse if it's a string (shouldn't happen, but for safety)
      if (typeof rawContent === "string") {
        console.log("[usePlayground] Parsing template from database (string)");
        const parsedContent = JSON.parse(rawContent);
        setTemplateData(parsedContent);
        toast.success("playground loaded successfully!");
        return;
      }

      console.log("[usePlayground] No template files in DB, calling API...");
      // If no template files exist in DB, generate from template starters
      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) throw new Error(`Failed to load template: ${res.status}`);

      const templateResponse = await res.json();
      console.log("[usePlayground] API response:", templateResponse);

      if (
        templateResponse.templateJson &&
        Array.isArray(templateResponse.templateJson)
      ) {
        setTemplateData({
          folderName: "Root",
          items: templateResponse.templateJson,
        });
      } else {
        setTemplateData(
          templateResponse.templateJson || {
            folderName: "Root",
            items: [],
          }
        );
      }

      toast.success("Template loaded successfully!");
    } catch (error) {
      console.error("[usePlayground] Error loading playground:", error);
      setError("Failed to load playground data");
      toast.error("Failed to load playground data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(async (data: TemplateFolder, showToast = true) => {
    try {
      await saveUpdatedCode(id, data);
      setTemplateData(data);
      if (showToast) {
        toast.success("Changes saved successfully!");
      }
    } catch (error) {
      console.error("Error saving template data: ", error);
      if (showToast) {
        toast.error("Failed to save changes");
      }
      throw error;
    }
  }, [id]);

  useEffect(() => {
    loadPlayground();
  }, [loadPlayground]);

  return {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  };
};
