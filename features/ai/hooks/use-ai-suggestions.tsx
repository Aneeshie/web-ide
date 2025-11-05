import { captureRejectionSymbol } from "events";
import { useCallback, useState } from "react";

interface AISuggestionsState {
  suggestion: string | null;
  isLoading: boolean;
  position: { line: number; column: number } | null;
  decoration: string[];
  isEnabled: boolean;
}

interface UseAISuggestionReturn extends AISuggestionsState {
  toggleEnabled: () => void;
  fetchSuggestion: (type: string, editor: any) => Promise<void>;
  acceptSuggestion: (editor: any, monaco: any) => void;
  rejectSuggestion: (editor: any) => any;
  clearSuggestion: (edtior: any) => void;
}

export const useAISuggestions = (): UseAISuggestionReturn => {
  const [state, setState] = useState<AISuggestionsState>({
    suggestion: null,
    isLoading: false,
    position: null,
    decoration: [],
    isEnabled: true,
  });

  const toggleEnabled = useCallback(() => {
    setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }));
  }, []);

  const fetchSuggestion = useCallback(async (type: string, editor: any) => {
    setState((curr) => {
      if (!curr.isEnabled) {
        console.warn("Ai suggestions are disabled!");
        return curr;
      }

      if (!editor) {
        console.warn("Editor instance is not available.");
        return curr;
      }

      const model = editor.getModel();
      const cursorPosition = editor.getPosition();

      if (!model || !cursorPosition) {
        console.warn("Editor model or cursor position is not available");
        return curr;
      }

      const newState = { ...curr, isLoading: true };

      //async operation
      // async operation
      (async () => {
        try {
          const payload = {
            fileContent: model.getValue(),
            cursorLine: cursorPosition.lineNumber - 1,
            cursorColumn: cursorPosition.column - 1,
            suggestionType: type,
          };

          const response = await fetch("/api/code-suggestion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
          }

          const data = await response.json();

          if (data.suggestion) {
            const suggestionText = data.suggestion.trim();
            setState((prev) => ({
              ...prev,
              suggestion: suggestionText,
              position: {
                line: cursorPosition.lineNumber,
                column: cursorPosition.column,
              },
              isLoading: false,
            }));
          } else {
            console.warn("No Suggestion received from API.");
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        } catch (err) {
          console.error("Error fetching code suggestion: ", err);
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      })();

      return newState;
    });
  }, []);

  const acceptSuggestion = useCallback(() => {
    (editor: any, monaco: any) => {
      setState((currentState) => {
        if (
          !currentState.suggestion ||
          !currentState.position ||
          !editor ||
          !monaco
        ) {
          return currentState;
        }

        const { line, column } = currentState.position;

        const sanitizedSuggestion = currentState.suggestion.replace(
          /^d+\s*/gm,
          ""
        );

        editor.executeEdits("", [
          {
            range: new monaco.Range(line, column, line, column),
            text: sanitizedSuggestion,
            forceMoveMarkers: true,
          },
        ]);

        if (editor && currentState.decoration.length > 0) {
          editor.deltaDecorations(currentState.decoration, []);
        }

        return {
          ...currentState,
          suggestion: null,
          position: null,
          decoration: [],
        };
      });
    };
  }, []);

  const rejectSuggestion = useCallback((editor: any) => {
    setState((curr) => {
      if (editor && curr.decoration.length > 0) {
        editor.deltaDecorations(curr.decoration, []);
      }
      return {
        ...curr,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  const clearSuggestion = useCallback((editor: any) => {
    setState((cur) => {
      if (editor && cur.decoration.length > 0) {
        editor.deltaDecorations(cur.decoration, []);
      }

      return {
        ...cur,
        suggestion: null,
        position: null,
        decoration: [],
      };
    });
  }, []);

  return {
    ...state,
    toggleEnabled,
    fetchSuggestion,
    acceptSuggestion,
    rejectSuggestion,
    clearSuggestion,
  };
};
