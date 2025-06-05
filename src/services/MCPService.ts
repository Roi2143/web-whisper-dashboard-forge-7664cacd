
export interface MCPRequest {
  request: string;
  type: 'action' | 'data';
}

export interface MCPResponse {
  success: boolean;
  type: 'action' | 'data';
  content: any;
  message: string;
}

export class MCPService {
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;
  private pendingRequests: Map<string, (response: MCPResponse) => void> = new Map();

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // This URL should be configured based on your MCP server setup
        // For now, using a placeholder - you'll need to replace with actual MCP endpoint
        const mcpUrl = process.env.REACT_APP_MCP_URL || 'ws://localhost:8080/mcp';
        
        this.websocket = new WebSocket(mcpUrl);
        
        this.websocket.onopen = () => {
          console.log('Connected to MCP server');
          this.isConnected = true;
          resolve();
        };
        
        this.websocket.onmessage = (event) => {
          try {
            const response = JSON.parse(event.data);
            this.handleMCPResponse(response);
          } catch (error) {
            console.error('Failed to parse MCP response:', error);
          }
        };
        
        this.websocket.onclose = () => {
          console.log('Disconnected from MCP server');
          this.isConnected = false;
        };
        
        this.websocket.onerror = (error) => {
          console.error('MCP WebSocket error:', error);
          this.isConnected = false;
          reject(new Error('Failed to connect to MCP server'));
        };
        
        // Timeout after 10 seconds
        setTimeout(() => {
          if (!this.isConnected) {
            reject(new Error('MCP connection timeout'));
          }
        }, 10000);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  async processRequest(request: string): Promise<MCPResponse> {
    if (!this.isConnected || !this.websocket) {
      throw new Error('MCP service not connected');
    }

    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      
      const mcpRequest = {
        id: requestId,
        request: request,
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
    this.isConnected = false;
    this.pendingRequests.clear();
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
