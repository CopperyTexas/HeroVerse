import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    SubscriberCardComponent,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.subscribers$;
  me = this.profileService.getMe();
  totalSubscribers: number = 0;
  menuItems = [
    { label: 'Home page', icon: 'home', link: 'profile/me' },
    { label: 'Chats', icon: 'message', link: 'chats' },
    { label: 'Search', icon: 'search', link: 'search' },
  ];
  // Метод trackById для *ngFor
  trackById(index: number, profile: Profile): string {
    return profile._id; // Возвращаем строковый идентификатор профиля для отслеживания изменений
  }
  ngOnInit() {
    // Загружаем данные пользователя
    this.loadUserData();

    // Обновляем количество подписчиков
    this.profileService.getTotalSubscribersCount().subscribe({
      next: (count) => {
        console.log('Total subscribers count:', count);
        this.totalSubscribers = count;
      },
      error: (err) => {
        console.error('Error loading total subscribers count:', err);
      },
    });
  }

  async loadUserData() {
    try {
      const userProfile = await firstValueFrom(this.profileService.getMe());
      console.log('User profile:', userProfile);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/404.svg';
  }
}
