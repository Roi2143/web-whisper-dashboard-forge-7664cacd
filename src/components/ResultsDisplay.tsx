
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AutomationResult } from '@/pages/Index';
import { CheckCircle, XCircle, Clock, Database, Zap } from 'lucide-react';
import { DataDashboard } from './DataDashboard';

interface ResultsDisplayProps {
  results: AutomationResult[];
}

export const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'data' ? (
      <Database className="w-4 h-4 text-blue-400" />
    ) : (
      <Zap className="w-4 h-4 text-purple-400" />
    );
  };

  if (results.length === 0) {
    return (
      <Card className="p-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm text-center">
        <div className="text-slate-400">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg mb-2">No automation results yet</p>
          <p className="text-sm">Results will appear here once you start an automation</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <Database className="w-5 h-5 text-blue-400" />
        Results & Dashboards
      </h2>
      
      {results.map((result, index) => (
        <Card key={index} className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getTypeIcon(result.type)}
              <Badge variant={result.type === 'data' ? 'default' : 'secondary'}>
                {result.type === 'data' ? 'Data Collection' : 'Action'}
              </Badge>
              {getStatusIcon(result.status)}
            </div>
            <span className="text-xs text-slate-400">
              {result.timestamp.toLocaleTimeString()}
            </span>
          </div>

          {result.message && (
            <p className="text-slate-300 text-sm mb-3">{result.message}</p>
          )}

          {result.type === 'data' ? (
            <DataDashboard data={result.content} />
          ) : (
            <div className="bg-slate-700/30 rounded-lg p-3">
              <p className="text-slate-200 text-sm font-medium mb-1">Action Completed:</p>
              <p className="text-slate-300 text-sm">{result.content.action}</p>
              <p className="text-green-400 text-xs mt-2">{result.content.result}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
