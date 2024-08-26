import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { ProfileFiltersComponent } from './profile-filters/profile-filters.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, CommonModule, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  profileService = inject(ProfileService);

  // Используем computed для получения данных из сигнала
  profiles = computed(() => this.profileService.filteredProfiles());

  constructor() {}

  ngOnInit() {
    // Инициализируем загрузку профилей с пустыми фильтрами при загрузке компонента
    this.loadProfiles({ nickname: '', power: '' });
  }

  // Метод для загрузки профилей с фильтрацией
  loadProfiles(filters: { nickname: string; power: string }) {
    this.profileService.filterProfiles(filters).subscribe(
      () => {
        // Профили уже обновлены через сигнал, ничего не требуется здесь делать
      },
      (error) => {
        console.error('Error loading profiles:', error);
      }
    );
  }

  // Метод для обработки изменения фильтров
  updateFilters(filters: { nickname: string; power: string }) {
    this.loadProfiles(filters);
  }

  trackById(index: number, profile: Profile): string {
    return profile._id;
  }
}
