import { useState, useEffect } from 'react';
import { AutomationChat } from '@/components/AutomationChat';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { StatusBar } from '@/components/StatusBar';
import { mcpService, ConnectionStatus } from '@/services/MCPService';

export interface AutomationResult {
  type: 'action' | 'data';
  content: any;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  message?: string;
}

const Index = () => {
  const [results, setResults] = useState<AutomationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  useEffect(() => {
    // Initiate the connection when the component mounts
    mcpService.connect().catch(err => {
      console.error("Initial MCP connection failed:", err);
    });

    const handleStatusChange = (status: ConnectionStatus) => {
      setConnectionStatus(status);
    };

    mcpService.addConnectionStatusListener(handleStatusChange);

    return () => {
      mcpService.removeConnectionStatusListener(handleStatusChange);
    };
  }, []);

  const handleAutomationRequest = async (request: string) => {
    if (connectionStatus !== 'connected') {
      const errorResult: AutomationResult = {
        type: 'action',
        content: { error: 'MCP service not connected' },
        timestamp: new Date(),
        status: 'error',
        message: 'Please ensure MCP server is connected before making requests'
      };
      setResults(prev => [errorResult, ...prev]);
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await mcpService.processRequest(request);
      
      const automationResult: AutomationResult = {
        type: result.type,
        content: result.content,
        timestamp: new Date(),
        status: result.success ? 'success' : 'error',
        message: result.message
      };
      
      setResults(prev => [automationResult, ...prev]);
    } catch (error) {
      console.error('Automation request failed:', error);
      
      const errorResult: AutomationResult = {
        type: 'action',
        content: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date(),
        status: 'error',
        message: 'Failed to process automation request'
      };
      
      setResults(prev => [errorResult, ...prev]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Web Automation Hub
          </h1>
          <p className="text-slate-300 text-lg">
            Describe your automation needs in natural language
          </p>
        </div>

        {/* Status Bar */}
        <StatusBar 
          isProcessing={isProcessing} 
          resultsCount={results.length}
          connectionStatus={connectionStatus}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <AutomationChat 
              onSubmit={handleAutomationRequest} 
              isProcessing={isProcessing}
              isConnected={connectionStatus === 'connected'}
            />
          </div>

          {/* Results Display */}
          <div className="lg:col-span-1">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
