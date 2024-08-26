import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { Profile } from '../../../data/interfaces/profile.interface';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-filters.component.html',
  styleUrls: ['./profile-filters.component.scss'], // исправлено с `styleUrl` на `styleUrls`
})
export class ProfileFiltersComponent {
  @Output() filtersChange = new EventEmitter<{
    nickname: string;
    power: string;
  }>();
  searchForm: FormGroup;
  profiles: Profile[] = [];

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    // Инициализация формы с полями nickname и power
    this.searchForm = this.fb.group({
      nickname: [''],
      power: [''],
    });

    // Подписка на изменения значений формы
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300), // Задержка для предотвращения частых запросов
        distinctUntilChanged(), // Отправка запроса только при изменении значения
        switchMap((formValue) => this.profileService.filterProfiles(formValue))
      )
      .subscribe({
        next: (response) => {
          // Обработка полученных данных
          this.profiles = response.items;
          console.log('Filtered profiles:', this.profiles);
        },
        error: (err) => {
          // Обработка ошибки
          console.error('Error filtering profiles:', err);
        },
      });
  }
}
