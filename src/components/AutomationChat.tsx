
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Bot, Loader2 } from 'lucide-react';

interface AutomationChatProps {
  onSubmit: (request: string) => void;
  isProcessing: boolean;
}

export const AutomationChat = ({ onSubmit, isProcessing }: AutomationChatProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; timestamp: Date }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

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
          placeholder="Describe what you want to automate..."
          className="min-h-24 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
          disabled={isProcessing}
        />
        
        <Button 
          type="submit" 
          disabled={!input.trim() || isProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
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
      {history.length === 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Example requests:</h3>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setInput(example)}
                className="text-left w-full p-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-700/30 rounded transition-colors"
                disabled={isProcessing}
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
