import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, CommonModule],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent implements OnInit {
  title = 'Angular'; // Название приложения
  profiles: Profile[] = []; // Массив для хранения данных профилей
  profileService = inject(ProfileService); // Инжектируем сервис для работы с профилями

  constructor() {}

  // Метод, который вызывается после инициализации компонента
  ngOnInit() {
    // Используем сервис для получения данных профилей
    this.profileService.getTestAccounts().subscribe(
      (value) => {
        // Успешно полученные данные сохраняем в массив profiles
        this.profiles = value;
      },
      (error) => {
        // Обрабатываем ошибку, если запрос завершился неудачно
        console.error(error);
      }
    );
  }

  // Метод для отслеживания идентификаторов профилей в *ngFor
  trackById(index: number, profile: Profile): number {
    return profile.id; // Возвращаем идентификатор профиля для отслеживания изменений
  }
}
