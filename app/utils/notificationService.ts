interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

async function sendNotification(notification: NotificationPayload) {
  const response = await fetch('/api/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notification),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send notification');
  }
  return data;
}

export class NotificationService {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseDelay = 1000;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  constructor(
    private onMessage: (data: any) => void,
    private onError?: (error: any) => void
  ) {}

  connect() {
    if (this.eventSource) {
      this.disconnect();
    }

    try {
      this.eventSource = new EventSource('/api/notifications');

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'heartbeat') {
            return;
          }
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
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendNotification(notification: NotificationPayload) {
    return sendNotification(notification);
  }

  private handleError(error: any) {
    if (this.onError) {
      this.onError(error);
    }

    this.disconnect();
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(this.baseDelay * Math.pow(2, this.reconnectAttempts), 30000);
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}