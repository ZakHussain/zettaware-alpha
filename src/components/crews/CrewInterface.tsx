import React, { useState } from 'react';
import { Users, Cpu, Bot, Code, CheckCircle, XCircle, AlertTriangle, Settings, Eye, Clock } from 'lucide-react';
import { useAppStore } from '../../store/app.store';
import { CREWS } from '../../config/crews.config';
import { ENDPOINTS } from '../../config/endpoints.config';
import { CrewEndpointViewerModal } from './CrewEndpointViewerModal';
import clsx from 'clsx';

const iconMap = {
  Cpu,
  Bot,
  Code
};

export function CrewInterface() {
  const { selectedCrew, setSelectedCrew, crewHealth, isViewingCrewEndpoints, startViewingCrewEndpoints } = useAppStore();
  const [hoveredCrew, setHoveredCrew] = useState<string | null>(null);

  const getHealthIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getHealthColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500';
      case 'degraded':
        return 'border-yellow-500';
      case 'unhealthy':
      default:
        return 'border-red-500';
    }
  };

  const getHealthStatus = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'degraded':
        return 'Degraded';
      case 'unhealthy':
      default:
        return 'Offline';
    }
  };

  return (
    <div className="flex flex-col h-full bg-theme-background">
      {/* Header */}
      <div className="bg-theme-surface border-b border-theme-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-theme-text flex items-center">
              <Users className="w-6 h-6 mr-2 text-theme-primary" />
              Crew Management
            </h1>
            <p className="text-theme-text-secondary mt-1">
              Select and manage your AI crews for different tasks
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-theme-text-secondary">
              <Settings className="w-4 h-4" />
              <span>Active: {CREWS[selectedCrew].name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crew Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(CREWS).map((crew) => {
            const IconComponent = iconMap[crew.icon as keyof typeof iconMap];
            const health = crewHealth[crew.id];
            const isSelected = selectedCrew === crew.id;
            const isHovered = hoveredCrew === crew.id;
            const crewEndpoints = ENDPOINTS.crews[crew.id]?.endpoints || {};
            
            return (
              <div
                key={crew.id}
                className={clsx(
                  'relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg group',
                  isSelected
                    ? `bg-theme-primary bg-opacity-10 border-theme-primary`
                    : `bg-theme-surface border-theme-border hover:border-theme-primary`,
                  getHealthColor(health?.status)
                )}
                onClick={() => setSelectedCrew(crew.id)}
                onMouseEnter={() => setHoveredCrew(crew.id)}
                onMouseLeave={() => setHoveredCrew(null)}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-theme-primary rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay and Button */}
                {isHovered && (
                  <>
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent crew selection
                          startViewingCrewEndpoints(crew.id);
                        }}
                        className="bg-theme-primary hover:bg-theme-primary-hover text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Endpoints</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={clsx(
                      'p-3 rounded-lg',
                      isSelected ? 'bg-theme-primary text-white' : crew.color
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-theme-text">{crew.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getHealthIcon(health?.status)}
                        <span className={clsx(
                          'text-sm font-medium',
                          health?.status === 'healthy' ? 'text-green-600' :
                          health?.status === 'degraded' ? 'text-yellow-600' : 'text-red-600'
                        )}>
                          {getHealthStatus(health?.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-theme-text-secondary text-sm mb-4 leading-relaxed">
                  {crew.description}
                </p>

                {/* Capabilities */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-theme-text mb-2">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {crew.capabilities.slice(0, 3).map((capability, index) => (
                      <span
                        key={index}
                        className={clsx(
                          'px-2 py-1 text-xs rounded-full',
                          isSelected 
                            ? 'bg-theme-primary bg-opacity-20 text-theme-primary'
                            : 'bg-theme-surface-hover text-theme-text-secondary'
                        )}
                      >
                        {capability}
                      </span>
                    ))}
                    {crew.capabilities.length > 3 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-theme-surface-hover text-theme-text-secondary">
                        +{crew.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Health Details */}
                {health && (
                  <div className="pt-4 border-t border-theme-border mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-theme-text-secondary">Uptime</span>
                        <p className="font-medium text-theme-text">
                          {Math.round(health.uptime / 1000)}s
                        </p>
                      </div>
                      <div>
                        <span className="text-theme-text-secondary">Last Check</span>
                        <p className="font-medium text-theme-text">
                          {health.lastCheck.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Endpoint Count */}
                <div className="pt-4 border-t border-theme-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-theme-text-secondary">Available Endpoints</span>
                    <span className="font-medium text-theme-text">
                      {Object.keys(crewEndpoints).length}
                    </span>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={clsx(
                  'absolute inset-0 rounded-xl bg-theme-primary opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none',
                  !isSelected && !isHovered && 'group-hover:opacity-5'
                )} />
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-theme-surface rounded-xl border border-theme-border">
          <h3 className="text-lg font-semibold text-theme-text mb-2">About Crews</h3>
          <p className="text-theme-text-secondary text-sm leading-relaxed">
            Each crew is specialized for different types of tasks. The Arduino Crew excels at hardware 
            analysis and embedded code generation, while the TankBot Crew focuses on robotics and 
            autonomous systems. The Coding Crew handles general-purpose software development tasks.
            Hover over any crew card and click "View Endpoints" to see detailed FastAPI endpoint information.
          </p>
        </div>
      </div>

      {/* Endpoint Viewer Modal */}
      {isViewingCrewEndpoints && <CrewEndpointViewerModal />}
    </div>
  );
}