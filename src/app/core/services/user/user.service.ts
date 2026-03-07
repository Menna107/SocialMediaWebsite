import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IchangePassword } from '../../models/ichange-password.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);

  changePassword(data: IchangePassword): Observable<any> {
    return this.httpClient.patch(`${environment.baseUrl}/users/change-password`, data);
  }
  uploadProfilePhoto(data: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/users/upload-photo`, data);
  }
  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/profile-data`);
  }
  getBookmarks(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/bookmarks`);
  }
  getFollowSuggestion(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/suggestions?limit=50`);
  }
  getUserProfile(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/${userId}/profile`);
  }
  followUnfollow(userId: string): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/users/${userId}/follow`, null);
  }
  getUserPosts(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/users/${userId}/posts`);
  }

  deleteUserCover(): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/users/cover`);
  }
  updateUserCover(data: FormData): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/users/upload-cover`, data);
  }
}
