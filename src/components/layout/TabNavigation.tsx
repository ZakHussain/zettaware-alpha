import React from "react";
import { MessageSquare, FileText, Zap, Settings, Users } from "lucide-react";
import { useAppStore } from "../../store/app.store";
import clsx from "clsx";

const tabs = [
  { id: "chat" as const, name: "Chat", icon: MessageSquare },
  { id: "artifacts" as const, name: "Artifacts", icon: FileText },
  // { id: 'documents' as const, name: 'Documents', icon: FileText },
  // { id: 'schematics' as const, name: 'Schematics', icon: Zap },
  // { id: 'system-editor' as const, name: 'System Editor', icon: Settings },
  { id: "crews" as const, name: "Crews", icon: Users },
];

export function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="bg-theme-surface border-b border-theme-border">
      <div className="flex">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative",
                isActive
                  ? "text-theme-primary bg-theme-background"
                  : "text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-hover"
              )}
            >
              <IconComponent className="w-4 h-4" />
              <span>{tab.name}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
