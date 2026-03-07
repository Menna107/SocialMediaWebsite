import { Component, inject, OnInit } from '@angular/core';
import { NotificationService } from '../../core/services/notification/notification.service';
import { DatePipe } from '@angular/common';
import { Notification } from '../../core/models/notification.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notification',
  imports: [DatePipe, RouterLink],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount: number = 0;

  private readonly notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.getNotification();
    this.getUnreadNotification();
  }

  getNotification() {
    this.notificationService.getNotification().subscribe({
      next: (res) => {
        this.notifications = res.data.notifications;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUnreadNotification() {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.data.unreadCount;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  markNotificationAsRead(notif: Notification) {
    this.notificationService.markNotificationAsRead(notif._id).subscribe({
      next: () => {
        notif.isRead = true;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach((n) => (n.isRead = true));
        this.unreadCount = 0;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMessage(type: string) {
    switch (type) {
      case 'like_post':
        return 'liked your post';
      case 'comment_post':
        return 'commented on your post';
      case 'follow':
        return 'started following you';
      case 'share_post':
        return 'shared your post';
      default:
        return 'interacted with your post';
    }
  }
}
