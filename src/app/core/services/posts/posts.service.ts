import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts`);
  }
  getFeedPosts(): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/feed?only=following`);
  }
  createPost(postData: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts`, postData);
  }
  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}`);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}`);
  }
  updatePost(postId: string, postData: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}`, postData);
  }
  likeUnlikePost(postId: string, postData: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/like`, postData);
  }
  getPostLikes(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/likes`);
  }
  sharePost(postId: string, postData: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/share`, postData);
  }
  savePost(postId: string, postData: any): Observable<any> {
    return this.httpClient.put(`${environment.baseUrl}/posts/${postId}/bookmark`, postData);
  }
}
