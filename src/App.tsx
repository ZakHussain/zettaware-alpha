import { useAppStore } from './store/app.store';
import { Sidebar } from './components/layout/Sidebar';
import { TabNavigation } from './components/layout/TabNavigation';
import { QueryProvider } from './providers/QueryProvider';
import { ChatInterface } from './components/chat/ChatInterface';
import { CrewInterface } from './components/crews/CrewInterface';

function App() {
  return (
    <QueryProvider>
      <AppContent />
    </QueryProvider>
  );
}

function AppContent() {
  const { activeTab, sidebarOpen } = useAppStore();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />
      case 'artifacts':
        return <h1>View Generated Artifacts - code test, sequential motion scripts</h1>
      case 'crews':
        return <CrewInterface />
      default:
        return <ChatInterface />
    }
  }

  return (
    <div className="flex h-screen bg-theme-background">
      <Sidebar />
      <div className={`flex-1 flex flex-col ${sidebarOpen ? '' : 'ml-0'}`}>
        <TabNavigation />
        <main className="flex-1 overflow-hidden">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;