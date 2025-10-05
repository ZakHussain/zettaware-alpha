import React from 'react';
import { X, Globe, Settings, FileText, Code, Eye, Copy, CheckCircle } from 'lucide-react';
import { useAppStore } from '../../store/app.store';
import { CREWS } from '../../config/crews.config';
import { ENDPOINTS } from '../../config/endpoints.config';
import clsx from 'clsx';

interface ExampleRequestProps {
  requestBody: Record<string, string>;
}

function ExampleRequest({ requestBody }: ExampleRequestProps) {
  const [copied, setCopied] = React.useState(false);

  const generateExampleRequestBody = (requestBody: Record<string, string>) => {
    const example: Record<string, any> = {};
    
    Object.entries(requestBody).forEach(([param, description]) => {
      const lowerDesc = description.toLowerCase();
      
      if (lowerDesc.includes('string')) {
        if (param.includes('prompt') || param.includes('message')) {
          example[param] = "Generate an Arduino sketch for blinking an LED";
        } else if (param.includes('context')) {
          example[param] = "Using Arduino Uno with built-in LED on pin 13";
        } else if (param.includes('model')) {
          example[param] = "gpt-4";
        } else if (param.includes('language')) {
          example[param] = "cpp";
        } else if (param.includes('framework')) {
          example[param] = "Arduino";
        } else if (param.includes('component')) {
          example[param] = "Arduino Uno";
        } else if (param.includes('robot_type')) {
          example[param] = "tank";
        } else if (param.includes('url')) {
          example[param] = "https://example.com/datasheet.pdf";
        } else {
          example[param] = `example_${param}`;
        }
      } else if (lowerDesc.includes('number')) {
        if (param.includes('temperature')) {
          example[param] = 0.7;
        } else if (param.includes('token')) {
          example[param] = 4096;
        } else {
          example[param] = 100;
        }
      } else if (lowerDesc.includes('array')) {
        if (param.includes('sensor')) {
          example[param] = ["ultrasonic", "gyroscope"];
        } else if (param.includes('component')) {
          example[param] = ["Arduino Uno", "LED", "Resistor"];
        } else if (param.includes('focus_areas')) {
          example[param] = ["performance", "security"];
        } else {
          example[param] = ["item1", "item2"];
        }
      } else if (lowerDesc.includes('object')) {
        example[param] = {
          "example_key": "example_value"
        };
      } else if (lowerDesc.includes('boolean')) {
        example[param] = true;
      } else {
        example[param] = `example_${param}`;
      }
    });
    
    return example;
  };

  const exampleJson = generateExampleRequestBody(requestBody);
  const jsonString = JSON.stringify(exampleJson, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-theme-text flex items-center">
          <Code className="w-4 h-4 mr-2 text-theme-accent" />
          Example Request
        </h4>
        <button
          onClick={copyToClipboard}
          className={clsx(
            'flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200',
            copied 
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-theme-surface-hover text-theme-text-secondary hover:bg-theme-surface border border-theme-border hover:text-theme-text'
          )}
          title="Copy example to clipboard"
        >
          {copied ? (
            <>
              <CheckCircle className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
        <div className="px-4 py-2 bg-theme-surface-hover border-b border-theme-border">
          <span className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
            JSON Request Body
          </span>
        </div>
        <div className="p-4">
          <pre className="text-sm overflow-x-auto">
            <code className="text-theme-text font-mono">
              {jsonString}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export function CrewEndpointViewerModal() {
  const { viewingCrewId, stopViewingCrewEndpoints } = useAppStore();

  if (!viewingCrewId) return null;

  const crew = CREWS[viewingCrewId];
  const crewEndpoints = ENDPOINTS.crews[viewingCrewId]?.endpoints || {};

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatJsonObject = (obj: any) => {
    if (typeof obj === 'object' && obj !== null) {
      return JSON.stringify(obj, null, 2);
    }
    return String(obj);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-theme-surface rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-theme-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={clsx('p-3 rounded-xl', crew.color)}>
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-theme-text flex items-center">
                  {crew.name} - API Endpoints
                </h2>
                <p className="text-theme-text-secondary mt-1">
                  Detailed view of all available FastAPI endpoints
                </p>
              </div>
            </div>
            <button
              onClick={stopViewingCrewEndpoints}
              className="p-2 text-theme-text-secondary hover:text-theme-text hover:bg-theme-surface-hover rounded-xl transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-6">
            {Object.entries(crewEndpoints).map(([key, endpoint]) => {
              if (typeof endpoint === 'string') return null;

              return (
                <div key={key} className="bg-theme-background rounded-xl border border-theme-border overflow-hidden">
                  {/* Endpoint Header */}
                  <div className="p-5 bg-theme-surface-hover border-b border-theme-border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Settings className="w-5 h-5 text-theme-accent" />
                          <h3 className="text-xl font-semibold text-theme-text">
                            {endpoint.name}
                          </h3>
                          <span className={clsx(
                            'px-3 py-1 text-sm font-medium rounded-full border',
                            getMethodColor(endpoint.request.method)
                          )}>
                            {endpoint.request.method}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-3">
                          <Globe className="w-4 h-4 text-theme-primary" />
                          <code className="text-theme-primary bg-theme-surface px-2 py-1 rounded text-sm font-mono">
                            {endpoint.request.method} {endpoint.path}
                          </code>
                        </div>

                        <p className="text-theme-text-secondary leading-relaxed">
                          {endpoint.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Endpoint Details */}
                  <div className="p-5 space-y-4">
                    {/* Usage */}
                    <div>
                      <h4 className="text-sm font-semibold text-theme-text mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-theme-success" />
                        When to Use
                      </h4>
                      <p className="text-theme-text-secondary text-sm leading-relaxed bg-theme-surface-hover p-3 rounded-lg">
                        {endpoint.usage}
                      </p>
                    </div>

                    {/* Request Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-theme-text mb-3 flex items-center">
                        <Code className="w-4 h-4 mr-2 text-theme-primary" />
                        Request Structure
                      </h4>
                      {endpoint.request.body && typeof endpoint.request.body === 'object' ? (
                        <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
                          <div className="px-4 py-2 bg-theme-surface-hover border-b border-theme-border">
                            <span className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
                              Request Body Parameters
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            {Object.entries(endpoint.request.body).map(([param, description]) => (
                              <div key={param} className="flex items-start space-x-3">
                                <code className="text-theme-accent bg-theme-surface-hover px-2 py-1 rounded text-sm font-mono flex-shrink-0">
                                  {param}
                                </code>
                                <span className="text-theme-text-secondary text-sm leading-relaxed">
                                  {description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-theme-surface-hover p-3 rounded-lg">
                          <span className="text-theme-text-secondary text-sm">
                            {endpoint.request.body || 'No request body required'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Example Request */}
                    {endpoint.request.body && typeof endpoint.request.body === 'object' && (
                      <ExampleRequest requestBody={endpoint.request.body} />
                    )}

                    {/* Response Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-theme-text mb-3 flex items-center">
                        <Code className="w-4 h-4 mr-2 text-theme-success" />
                        Response Structure
                      </h4>
                      {endpoint.response.body && typeof endpoint.response.body === 'object' ? (
                        <div className="bg-theme-surface rounded-lg border border-theme-border overflow-hidden">
                          <div className="px-4 py-2 bg-theme-surface-hover border-b border-theme-border">
                            <span className="text-xs font-medium text-theme-text-secondary uppercase tracking-wide">
                              Response Body Fields
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            {Object.entries(endpoint.response.body).map(([field, description]) => (
                              <div key={field} className="flex items-start space-x-3">
                                <code className="text-theme-success bg-theme-surface-hover px-2 py-1 rounded text-sm font-mono flex-shrink-0">
                                  {field}
                                </code>
                                <span className="text-theme-text-secondary text-sm leading-relaxed">
                                  {description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-theme-surface-hover p-3 rounded-lg">
                          <span className="text-theme-text-secondary text-sm">
                            {endpoint.response.body || 'Standard response format'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-theme-border bg-theme-surface-hover">
          <div className="flex items-center justify-between">
            <div className="text-sm text-theme-text-secondary">
              <span className="font-medium">{Object.keys(crewEndpoints).length}</span> endpoints available for {crew.name}
            </div>
            <button
              onClick={stopViewingCrewEndpoints}
              className="px-4 py-2 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}