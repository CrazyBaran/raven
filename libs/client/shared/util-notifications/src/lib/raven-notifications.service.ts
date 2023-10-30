import { Injectable } from '@angular/core';
import {
  NotificationService,
  NotificationSettings,
} from '@progress/kendo-angular-notification';

export type Notification = Pick<
  NotificationSettings,
  'content' | 'closable' | 'closeTitle' | 'width' | 'height' | 'animation'
>;

export type SuccessNotification = Notification;
export type ErrorNotification = Notification;
export type WarningNotification = Notification;
export type InfoNotification = Notification;

@Injectable({
  providedIn: 'root',
})
export class RavenNotificationsService {
  public constructor(private notificationService: NotificationService) {}

  public showSuccessNotification(notification: SuccessNotification): void {
    this.notificationService.show({
      cssClass: 'success',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      ...notification,
      type: { style: 'success', icon: true },
    });
  }

  public showErrorNotification(notification: ErrorNotification): void {
    this.notificationService.show({
      cssClass: 'error',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      ...notification,
      type: { style: 'error', icon: true },
    });
  }

  public showWarningNotification(notification: WarningNotification): void {
    this.notificationService.show({
      cssClass: 'warning',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      ...notification,
      type: { style: 'warning', icon: true },
    });
  }

  public showInfoNotification(notification: InfoNotification): void {
    this.notificationService.show({
      cssClass: 'info',
      animation: { type: 'slide', duration: 400 },
      position: { horizontal: 'center', vertical: 'top' },
      ...notification,
      type: { style: 'info', icon: true },
    });
  }
}
