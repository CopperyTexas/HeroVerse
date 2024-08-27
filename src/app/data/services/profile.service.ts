import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
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
  filteredProfiles = signal<Profile[]>([]);
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
  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file);
    return this.http.post<Profile>(
      `${this.baseApiUrl}/account/upload_image`,
      fd
    );
  }

  // Метод для фильтрации профилей
  filterProfiles(filters: {
    nickname: string;
    power: string;
  }): Observable<{ items: Profile[] }> {
    let params = new HttpParams();

    if (filters.nickname) {
      params = params.set('nickname', filters.nickname);
    }

    if (filters.power) {
      params = params.set('power', filters.power);
    }

    return this.getMe().pipe(
      switchMap(() =>
        this.http.get<{ items: Profile[] }>(`${this.baseApiUrl}/profiles`, {
          params,
        })
      ),
      tap((res) => {
        console.log('Current user profile (me):', this.me);
        console.log('Subscribers:', this.me?.subscribers);
        console.log('Profiles before filtering:', res.items);

        const filtered = res.items.filter((profile) => {
          return (
            profile._id !== this.me?._id &&
            !this.me?.subscribers?.some((sub) => sub._id === profile._id)
          );
        });

        console.log('Profiles after filtering:', filtered);

        this.filteredProfiles.set(filtered);
      })
    );
  }
  subscribeToProfile(profileId: string): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/account/subscribe`, {
      profileId,
    });
  }
}
