import { create } from "zustand";
import { CrewType } from "../config/endpoints.config";
import { Message } from "../schemas/message.schema";
import { HealthStatus } from "../api/contracts/crew.contract";
import { DEFAULT_MODEL } from "../config/models.config";

interface AppState {
  // UI State
  activeTab: "chat" | "artifacts" | "crews";
  sidebarOpen: boolean;

  // Crew Endpoint Viewing State
  isViewingCrewEndpoints: boolean;
  viewingCrewId: CrewType | null;

  // Configuration State
  selectedCrew: CrewType;
  selectedModel: string;
  selectedEndpoint: string;
  llmMode: "online" | "offline";

  // Chat State
  messages: Message[];
  isTyping: boolean;

  // Health State
  crewHealth: Record<CrewType, HealthStatus>;

  // Actions
  setActiveTab: (
    tab: "chat" | "artifacts" | "crews"
  ) => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedCrew: (crew: CrewType) => void;
  setSelectedModel: (model: string) => void;
  setSelectedEndpoint: (endpoint: string) => void;
  setLlmMode: (mode: "online" | "offline") => void;
  addMessage: (message: Message) => void;
  setIsTyping: (typing: boolean) => void;
  clearMessages: () => void;
  updateCrewHealth: (crew: CrewType, health: HealthStatus) => void;
  startViewingCrewEndpoints: (crewId: CrewType) => void;
  stopViewingCrewEndpoints: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  activeTab: "chat",
  sidebarOpen: true,
  isViewingCrewEndpoints: false,
  viewingCrewId: null,
  selectedCrew: "transbot",
  selectedModel: DEFAULT_MODEL,
  selectedEndpoint: "generate_sketch",
  llmMode: "online",
  messages: [],
  isTyping: false,
  documents: [],
  processingDocuments: new Set(),
  crewHealth: {} as Record<CrewType, HealthStatus>,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSelectedCrew: (crew) => set({ selectedCrew: crew }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSelectedEndpoint: (endpoint) => set({ selectedEndpoint: endpoint }),
  setLlmMode: (mode) => set({ llmMode: mode }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setIsTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),
  updateCrewHealth: (crew, health) => set((state) => ({
    crewHealth: { ...state.crewHealth, [crew]: health}
  })),
  startViewingCrewEndpoints: (crewId) => set({ 
    isViewingCrewEndpoints: true, 
    viewingCrewId: crewId 
  }),
  
  stopViewingCrewEndpoints: () => set({ 
    isViewingCrewEndpoints: false, 
    viewingCrewId: null 
  })
}));
