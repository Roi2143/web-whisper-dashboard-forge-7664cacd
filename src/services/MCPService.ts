export interface MCPRequest {
  id: string;
  request: string;
  type: 'action' | 'data';
  timestamp: string;
}

export interface MCPResponse {
  success: boolean;
  type: 'action' | 'data';
  content: any;
  message: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
type ConnectionStatusListener = (status: ConnectionStatus) => void;

export class MCPService {
  private websocket: WebSocket | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private connectionStatusListeners: ConnectionStatusListener[] = [];
  private pendingRequests: Map<string, (response: MCPResponse) => void> = new Map();

  private setConnectionStatus(status: ConnectionStatus) {
    console.log(`[MCPService] Setting connection status to: ${status}`);
    this.connectionStatus = status;
    this.connectionStatusListeners.forEach(listener => listener(status));
  }

  addConnectionStatusListener(listener: ConnectionStatusListener) {
    this.connectionStatusListeners.push(listener);
    listener(this.connectionStatus); // Immediately notify with current status
  }

  removeConnectionStatusListener(listener: ConnectionStatusListener) {
    this.connectionStatusListeners = this.connectionStatusListeners.filter(l => l !== listener);
  }

  async connect(): Promise<void> {
    console.log('[MCPService] Attempting to connect...');
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      console.log('[MCPService] Already connected.');
      return;
    }
    this.setConnectionStatus('connecting');
    return new Promise((resolve, reject) => {
      try {
        // This URL should be configured based on your MCP server setup
        // For now, using a placeholder - you'll need to replace with actual MCP endpoint
        const mcpUrl = import.meta.env.VITE_MCP_URL || 'ws://localhost:8080/mcp';
        console.log(`[MCPService] Connecting to WebSocket at: ${mcpUrl}`);
        
        this.websocket = new WebSocket(mcpUrl);
        
        this.websocket.onopen = () => {
          console.log('[MCPService] WebSocket connection opened.');
          this.setConnectionStatus('connected');
          resolve();
        };
        
        this.websocket.onmessage = (event) => {
          console.log('[MCPService] Received message:', event.data);
          try {
            const response = JSON.parse(event.data);
            this.handleMCPResponse(response);
          } catch (error) {
            console.error('[MCPService] Failed to parse MCP response:', error);
          }
        };
        
        this.websocket.onclose = (event) => {
          console.log(`[MCPService] WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
          this.setConnectionStatus('disconnected');
        };
        
        this.websocket.onerror = (error) => {
          console.error('[MCPService] WebSocket error:', error);
          this.setConnectionStatus('error');
          reject(new Error('Failed to connect to MCP server'));
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (this.connectionStatus !== 'connected') {
            console.log('[MCPService] Connection timed out after 10 seconds.');
            this.setConnectionStatus('error');
            reject(new Error('MCP connection timeout'));
          }
        }, 10000);
        
      } catch (error) {
        console.error('[MCPService] Error in connect method:', error);
        reject(error);
      }
    });
  }

  async processRequest(request: string, type: 'action' | 'data' = 'data'): Promise<MCPResponse> {
    if (this.connectionStatus !== 'connected' || !this.websocket) {
      throw new Error('MCP service not connected');
    }

    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      
      const mcpRequest: MCPRequest = {
        id: requestId,
        request: request,
        type: type,
        timestamp: new Date().toISOString()
      };

      // Store the resolver for this request
      this.pendingRequests.set(requestId, resolve);

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Request timeout'));
        }
      }, 30000); // 30 second timeout

      // Send request to MCP server
      this.websocket!.send(JSON.stringify(mcpRequest));
    });
  }

  private handleMCPResponse(response: any): void {
    const { id, success, type, content, message } = response;
    
    if (this.pendingRequests.has(id)) {
      const resolver = this.pendingRequests.get(id)!;
      this.pendingRequests.delete(id);
      
      resolver({
        success,
        type,
        content,
        message
      });
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.setConnectionStatus('disconnected');
    this.pendingRequests.clear();
  }

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }
}

export const mcpService = new MCPService();
