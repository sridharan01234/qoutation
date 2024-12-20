export class NotificationService {
  private onSuccess: (data: any) => void;
  private onError: (error: any) => void;

  constructor(
    onSuccess: (data: any) => void,
    onError: (error: any) => void
  ) {
    this.onSuccess = onSuccess;
    this.onError = onError;
  }

  async sendNotification(notification: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    try {
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

      this.onSuccess(data);
      return data;
    } catch (error) {
      this.onError(error);
      throw error;
    }
  }
}