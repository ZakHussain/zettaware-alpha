import { 
  Activity, 
  Brain,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/app.store';
import { useCrewHealth } from '../../hooks/useCrewHealth';
import { CREWS } from '../../config/crews.config';
import { ENDPOINTS } from '../../config/endpoints.config';
import { MODELS } from '../../config/models.config';
import { ThemeSelector } from '../ui/ThemeSelector';

export function Sidebar() {
  const {
    sidebarOpen,
    setSidebarOpen,
    selectedCrew,
    setSelectedCrew,
    selectedModel,
    setSelectedModel,
    selectedEndpoint,
    setSelectedEndpoint,
    crewHealth,
  } = useAppStore();

  useCrewHealth(); // Initialize health monitoring
  const { refetch: refetchHealth } = useCrewHealth();

  const getHealthIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  if (!sidebarOpen) {
    return (
      <div className="w-16 bg-theme-sidebar border-r border-theme-sidebar-border flex flex-col items-center py-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-theme-sidebar border-r border-theme-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-theme-sidebar-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-theme-primary" />
          <h1 className="text-lg font-semibold text-theme-sidebar-text">ZettaSource α</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Connection Health */}
      <div className="p-4 border-b border-theme-sidebar-border">
        <h2 className="text-sm font-medium text-theme-sidebar-text-secondary mb-3 flex items-center justify-between">
          <span className="flex items-center">
            <Activity className="w-4 h-4 mr-2 text-theme-sidebar-text" />
            Connection Health
          </span>
          <button
            onClick={() => refetchHealth()}
            className="p-1 text-theme-sidebar-text-secondary hover:text-theme-sidebar-text hover:bg-theme-surface rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </h2>
        <div className="space-y-2">
          {Object.entries(crewHealth).map(([crewId, health]) => {
            const crew = CREWS[crewId as keyof typeof CREWS];
            if (!crew) return null;

            return (
              <div
                key={crewId}
                className="flex items-center justify-between p-2 bg-theme-surface rounded text-sm"
              >
                <span className="text-theme-sidebar-text">{crew.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-theme-sidebar-text-secondary">
                    {Math.round(health.uptime / 1000)}s
                  </span>
                  {getHealthIcon(health.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crew Selection */}
      <div className="p-4 border-b border-theme-sidebar-border">
        <h2 className="text-sm font-medium text-theme-sidebar-text-secondary mb-3">Select Crew</h2>
        <select
          value={selectedCrew}
          onChange={(e) => setSelectedCrew(e.target.value as keyof typeof CREWS)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          {Object.entries(CREWS).map(([id, crew]) => (
            <option key={id} value={id}>
              {crew.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Selection */}
      <div className="p-4 border-b border-theme-sidebar-border">
        <h2 className="text-sm font-medium text-theme-sidebar-text-secondary mb-3">Model</h2>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          {Object.values(MODELS).map((model) => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      {/* Endpoint Selection */}
      <div className="p-4 border-b border-theme-sidebar-border">
        <h2 className="text-sm font-medium text-theme-sidebar-text-secondary mb-3">Endpoint</h2>
        <select
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          {selectedCrew && Object.entries(ENDPOINTS.crews[selectedCrew].endpoints).map(([key, endpoint]) => (
            <option key={key} value={key}>
              {endpoint.name}
            </option>
          ))}
        </select>
      </div>

      {/* Theme Selector */}
      <div className="p-4 mt-auto">
        <div className="flex justify-start">
          <ThemeSelector />
        </div>
      </div>
    </div>
  );
}