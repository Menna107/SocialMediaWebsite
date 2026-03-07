import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getPostComments(postId: string): Observable<any> {
    return this.httpClient.get(`${environment.baseUrl}/posts/${postId}/comments`);
  }
  getCommentReplay(postId: string, commentId: string): Observable<any> {
    return this.httpClient.get(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
    );
  }

  createComment(postId: string, commentData: any): Observable<any> {
    return this.httpClient.post(`${environment.baseUrl}/posts/${postId}/comments`, commentData);
  }

  createReplay(postId: string, commentId: string, commentData: any): Observable<any> {
    return this.httpClient.post(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
      commentData,
    );
  }

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.baseUrl}/posts/${postId}/comments/${commentId}`);
  }
  updateComment(postId: string, commentId: string, commentData: any): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}`,
      commentData,
    );
  }

  likeUnlikeComment(postId: string, commentId: string, commentData: any): Observable<any> {
    return this.httpClient.put(
      `${environment.baseUrl}/posts/${postId}/comments/${commentId}/like`,
      commentData,
    );
  }
}
