
import { useState } from 'react';
import { AutomationChat } from '@/components/AutomationChat';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { StatusBar } from '@/components/StatusBar';

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

  const handleAutomationRequest = async (request: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock result - in real implementation, this would come from your MCP server
    const mockResult: AutomationResult = {
      type: request.toLowerCase().includes('scrape') || request.toLowerCase().includes('data') || request.toLowerCase().includes('collect') ? 'data' : 'action',
      content: request.toLowerCase().includes('scrape') ? {
        title: 'Scraped Data Results',
        data: [
          { name: 'Product A', price: '$99.99', rating: 4.5 },
          { name: 'Product B', price: '$149.99', rating: 4.2 },
          { name: 'Product C', price: '$79.99', rating: 4.8 }
        ]
      } : {
        action: request,
        result: 'Successfully completed automation task'
      },
      timestamp: new Date(),
      status: 'success',
      message: request.toLowerCase().includes('scrape') ? 'Data successfully scraped and processed' : 'Automation action completed successfully'
    };
    
    setResults(prev => [mockResult, ...prev]);
    setIsProcessing(false);
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
        <StatusBar isProcessing={isProcessing} resultsCount={results.length} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          {/* Chat Interface */}
          <div className="lg:col-span-1">
            <AutomationChat 
              onSubmit={handleAutomationRequest} 
              isProcessing={isProcessing}
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
