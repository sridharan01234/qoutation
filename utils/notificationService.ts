// utils/notificationService.ts
export class NotificationService {
    private eventSource: EventSource | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private baseDelay = 1000;
  
    constructor(private onMessage: (data: any) => void, private onError?: (error: any) => void) {}
  
    connect() {
      if (this.eventSource) {
        this.disconnect();
      }
  
      try {
        this.eventSource = new EventSource('/api/notifications');
  
        this.eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'heartbeat') return;
            this.onMessage(data);
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        };
  
        this.eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          this.handleError(error);
        };
  
        this.eventSource.onopen = () => {
          console.log('SSE connection established');
          this.reconnectAttempts = 0;
        };
      } catch (error) {
        console.error('Error creating EventSource:', error);
        this.handleError(error);
      }
    }
  
    private handleError(error: any) {
      if (this.onError) {
        this.onError(error);
      }
  
      this.disconnect();
  
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;
        console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
        setTimeout(() => this.connect(), delay);
      }
    }
  
    disconnect() {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    }
  }
  