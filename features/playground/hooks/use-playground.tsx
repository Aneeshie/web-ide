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
  saveTemplateData: (data: TemplateFolder) => Promise<void>;
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

      //@ts-expect-error later
      setPlaygroundData(pg);
      const rawContent = pg?.templateFiles?.[0]?.content;

      if (typeof rawContent === "string") {
        const parsedContent = JSON.parse(rawContent);
        setTemplateData(parsedContent);
        toast.success("playground loaded successfully!");
        return;
      }

      const res = await fetch(`/api/template/${id}`);
      if (!res.ok) throw new Error(`Failed to load template: ${res.status}`);

      const templateResponse = await res.json();

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
      console.log("error loading playground", error);
      setError("Failed to load playground data");
      toast.error("Failed to load playground data");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const saveTemplateData = useCallback(async (data: TemplateFolder) => {
    try {
      await saveUpdatedCode(id, data);
      setTemplateData(data);
      toast.success("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving template data: ", error);
      toast.error("Failed to save changes");
      throw error;
    }
  }, []);

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
