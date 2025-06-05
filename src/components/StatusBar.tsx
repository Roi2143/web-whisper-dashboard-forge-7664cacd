
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Loader2 } from 'lucide-react';

interface StatusBarProps {
  isProcessing: boolean;
  resultsCount: number;
}

export const StatusBar = ({ isProcessing, resultsCount }: StatusBarProps) => {
  return (
    <Card className="p-4 bg-slate-800/30 border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">System Status</span>
          </div>
          
          <Badge variant={isProcessing ? "default" : "secondary"} className="flex items-center gap-1">
            {isProcessing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3" />
                Ready
              </>
            )}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>Results: {resultsCount}</span>
          <span>•</span>
          <span>Connected to MCP Server</span>
        </div>
      </div>
    </Card>
  );
};
