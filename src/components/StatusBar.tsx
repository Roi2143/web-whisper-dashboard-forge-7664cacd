
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, Loader2, XCircle, AlertCircle } from 'lucide-react';

interface StatusBarProps {
  isProcessing: boolean;
  resultsCount: number;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export const StatusBar = ({ isProcessing, resultsCount, connectionStatus }: StatusBarProps) => {
  const getConnectionStatusInfo = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: <CheckCircle className="w-3 h-3" />,
          text: 'Connected to MCP Server',
          variant: 'default' as const,
          color: 'text-green-400'
        };
      case 'connecting':
        return {
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          text: 'Connecting to MCP Server',
          variant: 'secondary' as const,
          color: 'text-yellow-400'
        };
      case 'error':
        return {
          icon: <XCircle className="w-3 h-3" />,
          text: 'MCP Connection Error',
          variant: 'destructive' as const,
          color: 'text-red-400'
        };
      case 'disconnected':
      default:
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          text: 'MCP Server Disconnected',
          variant: 'secondary' as const,
          color: 'text-slate-400'
        };
    }
  };

  const connectionInfo = getConnectionStatusInfo();

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

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">Results: {resultsCount}</span>
          <span className="text-slate-400">•</span>
          <div className={`flex items-center gap-1 ${connectionInfo.color}`}>
            {connectionInfo.icon}
            <span className="text-sm">{connectionInfo.text}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
