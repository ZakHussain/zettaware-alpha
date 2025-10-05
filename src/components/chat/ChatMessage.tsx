import { Copy, User, Bot, Clock, Cpu } from "lucide-react";
import { Message } from "../../schemas/message.schema";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import clsx from "clsx";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const renderContent = () => {
    if (isUser || isSystem) {
      return (
        <div className="prose prose-sm max-w-none">
          <p className="text-theme-text whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
      );
    }

    return (
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              if (!inline && match) {
                return (
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(String(children))}
                      className="absolute top-2 right-2 p-1 bg-gray-600 hover:bg-gray-500 rounded text-white opacity-70 hover:opacity-100 transition-opacity"
                      title="Copy code"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={language}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                );
              }

              return (
                <code
                  className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div
      className={clsx(
        "flex space-x-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center">
          {isSystem ? (
            <Cpu className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
      )}

      <div
        className={clsx(
          "max-w-3xl rounded-lg p-4",
          isUser
            ? "bg-blue-500 text-white ml-auto"
            : isSystem
            ? "bg-theme-surface border border-theme-border"
            : "bg-theme-chat-assistant-bg border border-theme-border shadow-sm"
        )}
      >
        {renderContent()}

        {/* Metadata */}
        
        {/* {message.metadata && (
          <div className="mt-3 pt-3 border-t border-gray-200 border-opacity-50">
            <div className="flex items-center text-xs opacity-70 space-x-4">
              <span className="flex items-center space-x-1 text-theme-text-secondary">
                <Clock className="w-3 h-3" />
                <span>{message.timestamp.toLocaleTimeString()}</span>
              </span>

              {message.metadata.crew && (
                <span>Crew: {message.metadata.crew}</span>
              )}

              {message.metadata.executionTime && (
                <span>{message.metadata.executionTime}ms</span>
              )}

              {message.metadata.tokens && (
                <span>
                  {message.metadata.tokens.input +
                    message.metadata.tokens.output}{" "}
                  tokens
                </span>
              )}
            </div>
          </div>
        )} */}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-primary flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}
