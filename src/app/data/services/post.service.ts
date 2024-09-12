import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post, PostCreateDto } from '../interfaces/post.interface';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  #http = inject(HttpClient);
  baseApiUrl = environment.apiUrl;
  posts = signal<Post[]>([]);

  createPost(payload: PostCreateDto): Observable<Post[]> {
    return this.#http.post<Post>(`${this.baseApiUrl}/post`, payload).pipe(
      switchMap(() => this.fetchPosts()) // После создания поста, обновляем список постов
    );
  }

  fetchPosts(): Observable<Post[]> {
    return this.#http
      .get<Post[]>(`${this.baseApiUrl}/post`)
      .pipe(tap((res) => this.posts.set(res))); // Обновляем сигнал posts
  }
  // Метод для получения профиля по authorId
  getProfile(authorId: string): Observable<Profile> {
    return this.#http.get<Profile>(`${this.baseApiUrl}/account/${authorId}`);
  }
}
