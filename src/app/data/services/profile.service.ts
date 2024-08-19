// Импортируем HttpClient для выполнения HTTP-запросов
import { HttpClient } from '@angular/common/http';

// Импортируем Injectable для создания сервиса и inject для инъекции зависимостей
import { Injectable, inject } from '@angular/core';

// Импортируем Observable из RxJS для обработки асинхронных операций
import { Observable, map, tap } from 'rxjs';

// Импортируем объект environment для доступа к переменным окружения
import { environment } from '../../../environments/environment';

// Импортируем интерфейс Profile для типизации данных профилей
import { Pageble } from '../interfaces/pageble.interface';
import { Profile } from '../interfaces/profile.interface';
// Декоратор Injectable указывает, что этот класс можно инжектировать как зависимость
@Injectable({
  providedIn: 'root', // Этот сервис будет доступен на уровне корневого модуля
})
export class ProfileService {
  // Инжектируем HttpClient для выполнения HTTP-запросов
  http = inject(HttpClient);
  // Получаем базовый URL API из переменных окружения
  baseApiUrl = environment.apiUrl;
  // Конструктор класса (в данном случае пустой)
  constructor() {}
  me: Profile | null = null;
  // Метод для получения списка тестовых аккаунтов
  // Возвращает Observable, который эмитирует массив объектов типа Profile
  getTestAccounts(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.baseApiUrl}/users`);
  }
  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}/account/${id}`);
  }
  getMe(): Observable<Profile> {
    return this.http
      .get<Profile>(`${this.baseApiUrl}/account/me`)
      .pipe(tap((profile) => (this.me = profile)));
  }
  getSubscribersShortList() {
    return this.http
      .get<Pageble<Profile>>(`${this.baseApiUrl}/account/subscribers`)
      .pipe(map((res) => res.items.slice(0, 3)));
  }
}
