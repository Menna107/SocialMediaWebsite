import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  getNotification(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/notifications`);
  }
  getUnreadCount(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/notifications/unread-count`);
  }
  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}/notifications/${notificationId}/read`, {});
  }
  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}/notifications/read-all`, {});
  }
}
