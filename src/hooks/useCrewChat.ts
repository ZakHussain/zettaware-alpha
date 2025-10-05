import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrewService } from "../api/services/crew.service";
import { useAppStore } from "../store/app.store";
import { Message } from "../schemas/message.schema";
import { CrewType } from "../config/endpoints.config";

const crewService = new CrewService();

export function useCrewChat() {
  const queryClient = useQueryClient();
  const {
    selectedCrew,
    selectedEndpoint,
    selectedModel,
    llmMode,
    setLlmMode,
    addMessage,
    setIsTyping,
    clearMessages,
  } = useAppStore();

  const sendMessage = useMutation({
    mutationFn: async ({
      message,
      context,
    }: {
      message: string;
      context?: string;
    }) => {
      console.log("[useCrewChat] Sending message:", {
        message,
        context,
        selectedCrew,
        selectedEndpoint,
        selectedModel,
      });

      // Add user message immediately
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: message,
        role: "user",
        timestamp: new Date(),
        // metadata: {
        //   crew: selectedCrew,
        //   endpoint: selectedEndpoint,
        //   model: selectedModel,
        // },
      };

      addMessage(userMessage);
      setIsTyping(true);

      try {
        const response = await crewService.sendMessage(
          selectedCrew,
          selectedEndpoint,
          userMessage,
          context,
          selectedModel
        );

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: response.message || "No response received",
          role: "assistant",
          timestamp: new Date(),
          // metadata: {
          //   crew: selectedCrew,
          //   endpoint: selectedEndpoint,
          //   model: selectedModel,
          //   executionTime: response.executionTime,
          //   tokens: response.tokens,
          // },
        };

        addMessage(assistantMessage);
        return response;
      } finally {
        setIsTyping(false);
      }
    },
    onError: (error) => {
      setIsTyping(false);

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: `Error: ${
          error instanceof Error ? error.message : "An error occurred"
        }`,
        role: "assistant",
        timestamp: new Date(),
        // metadata: {
        //   crew: selectedCrew,
        //   endpoint: selectedEndpoint,
        //   model: selectedModel,
        // },
      };

      addMessage(errorMessage);
    },
  });

  return {
    sendMessage: sendMessage.mutate,
    isLoading: sendMessage.isPending,
    error: sendMessage.error,
    llmMode,
    setLlmMode,
    clearMessages,
  };
}
