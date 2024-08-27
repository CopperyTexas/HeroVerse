// Импортируем необходимые модули и интерфейсы
import { CommonModule } from '@angular/common'; // Модуль, предоставляющий общие директивы, такие как *ngIf и *ngFor
import { Component, inject, Input } from '@angular/core'; // Импортируем Component для создания компонента и Input для передачи данных в компонент
import { environment } from '../../../environments/environment'; // Импортируем объект environment для доступа к переменным окружения
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
// Импортируем интерфейс Profile для типизации данных профилей

// Декоратор @Component указывает, что это класс компонента
@Component({
  selector: 'app-profile-card', // Селектор, используемый для внедрения этого компонента в HTML
  standalone: true, // Указывает, что этот компонент является автономным и не принадлежит какому-либо модулю
  imports: [CommonModule], // Импортируем CommonModule для использования директив, таких как *ngIf и *ngFor
  templateUrl: './profile-card.component.html', // Шаблон компонента
  styleUrls: ['./profile-card.component.scss'], // Стили компонента
})
export class ProfileCardComponent {
  [x: string]: any;
  // @Input() декоратор используется для получения данных из родительского компонента
  @Input() profile: Profile | undefined;
  profileService = inject(ProfileService);
  isSubscribed: boolean = false;
  ngOnInit() {
    // Проверяем, подписан ли текущий пользователь на данный профиль
    this.isSubscribed =
      this.profileService.me?.subscribers.some(
        (sub) => sub._id === this.profile?._id
      ) || false;
  }
  subscribe() {
    if (this.profile) {
      // Проверяем, что profile не undefined
      this.profileService.subscribeToProfile(this.profile._id).subscribe({
        next: (response) => {
          console.log('Successfully subscribed:', response);
          // Обновите состояние компонента, если необходимо (например, изменить текст кнопки)
          this.isSubscribed = true;
        },
        error: (err) => {
          console.error('Error subscribing to profile:', err);
        },
      });
    } else {
      console.error('Profile is undefined');
    }
  }
  // Метод для получения полного URL аватара профиля
  get avatarUrl(): string {
    // Если профиль определен, формируем URL аватара с использованием переменной окружения
    // В противном случае возвращаем пустую строку
    return this.profile
      ? `${environment.assetsUrl}/${this.profile.avatar}`
      : '';
  }
}
