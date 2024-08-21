import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pageble } from '../interfaces/pageble.interface';
import { Profile } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiUrl = environment.apiUrl;

  me: Profile | null = null;

  constructor() {
    // Вызов getMe в конструкторе может быть, но убедитесь, что это не создаёт проблем с синхронизацией
    this.getMe().subscribe();
  }

  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/users`);
  }

  getAccount(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/account/${id}`);
  }

  getMe(): Observable<Profile> {
    return this.http.get<Profile>(`${this.baseApiUrl}/account/me`).pipe(
      tap((profile) => {
        this.me = profile;
      })
    );
  }

  getSubscribersShortList(subsAmount = 3): Observable<Profile[]> {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}/account/subscribers`)
      .pipe(map((res) => res.items.slice(0, subsAmount)));
  }
  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(`${this.baseApiUrl}/account/me`, profile);
  }
}
