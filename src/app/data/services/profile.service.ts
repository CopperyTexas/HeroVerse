import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap, tap } from 'rxjs';
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
  private subscribersSubject = new BehaviorSubject<Profile[]>([]);
  subscribers$ = this.subscribersSubject.asObservable();

  constructor() {
    // Вызов getMe в конструкторе может быть, но убедитесь, что это не создаёт проблем с синхронизацией
    this.getMe().subscribe();
  }
  private loadSubscribers() {
    this.getSubscribersShortList().subscribe();
  }
  updateSubscribers() {
    this.getSubscribersShortList().subscribe((subscribers) => {
      this.subscribersSubject.next(subscribers);
    });
  }
  getTotalSubscribersCount(): Observable<number> {
    return this.http
      .get<Profile[]>(`${this.baseApiUrl}/account/subscribers`)
      .pipe(tap((subscribers) => this.subscribersSubject.next(subscribers)))
      .pipe(map((subscribers) => subscribers.length)); // Возвращаем только количество подписчиков
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
        this.loadSubscribers();
      })
    );
  }
  getSubscribersLongList(): Observable<Profile[]> {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}/account/subscribers`, {
        params: new HttpParams().set('size', '1000'), // Устанавливаем большое значение для получения всех подписчиков
      })
      .pipe(map((res) => res.items));
  }
  getSubscribersShortList(subsAmount = 5): Observable<Profile[]> {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}/account/subscribers`)
      .pipe(
        map((res) => res.items.slice(0, subsAmount)),
        tap((shortList) => {
          this.subscribersSubject.next(shortList); // Обновляем список подписчиков
        })
      );
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
    return this.http
      .post(`${this.baseApiUrl}/account/subscribe`, { profileId })
      .pipe(
        tap(() => {
          // Обновляем список подписчиков после успешной подписки
          this.addNewSubscriber(profileId);
        })
      );
  }
  unsubscribeFromProfile(profileId: string): Observable<any> {
    return this.http
      .post(`${this.baseApiUrl}/account/unsubscribe`, { profileId })
      .pipe(
        tap(() => {
          // Обновляем список подписчиков после успешной отписки
          this.updateSubscribers();
        })
      );
  }

  private addNewSubscriber(profileId: string) {
    this.http
      .get<Profile>(`${this.baseApiUrl}/account/${profileId}`)
      .subscribe({
        next: (profile) => {
          const currentSubscribers = this.subscribersSubject.getValue();
          this.subscribersSubject.next([...currentSubscribers, profile]);
        },
        error: (err) => {
          console.error('Error fetching subscribed profile:', err);
        },
      });
  }
}
