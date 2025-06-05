
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Bot, Loader2, AlertTriangle } from 'lucide-react';

interface AutomationChatProps {
  onSubmit: (request: string) => void;
  isProcessing: boolean;
  isConnected: boolean;
}

export const AutomationChat = ({ onSubmit, isProcessing, isConnected }: AutomationChatProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; timestamp: Date }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing || !isConnected) return;

    const request = input.trim();
    setHistory(prev => [...prev, { text: request, timestamp: new Date() }]);
    setInput('');
    onSubmit(request);
  };

  const examples = [
    "Scrape product prices from Amazon for iPhone 15",
    "Fill out contact form on company website",
    "Monitor competitor pricing every hour",
    "Extract email addresses from LinkedIn profiles",
    "Automate social media posting schedule"
  ];

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="w-5 h-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Automation Request</h2>
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 text-sm">
            MCP server not connected. Automation requests will fail until connection is established.
          </span>
        </div>
      )}

      {/* Chat History */}
      {history.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto space-y-2">
          {history.map((item, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-3">
              <p className="text-slate-200 text-sm">{item.text}</p>
              <p className="text-slate-400 text-xs mt-1">
                {item.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isConnected ? "Describe what you want to automate..." : "Connect to MCP server to start automating..."}
          className="min-h-24 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
          disabled={isProcessing || !isConnected}
        />
        
        <Button 
          type="submit" 
          disabled={!input.trim() || isProcessing || !isConnected}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : !isConnected ? (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              MCP Disconnected
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Start Automation
            </>
          )}
        </Button>
      </form>

      {/* Example Requests */}
      {history.length === 0 && isConnected && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Example requests:</h3>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="text-left w-full p-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 rounded transition-colors disabled:opacity-50"
                disabled={isProcessing || !isConnected}
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
