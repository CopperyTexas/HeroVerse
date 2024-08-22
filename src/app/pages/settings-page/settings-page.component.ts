import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    description: [''],
    power: [''],
  });

  constructor() {
    this.loadProfileData();
  }

  loadProfileData() {
    effect(() => {
      if (this.profileService.me) {
        const profile = this.profileService.me;

        this.form.patchValue({
          firstName: profile.name.split(' ')[0] || '',
          lastName: profile.name.split(' ')[1] || '',
          username: profile.username,
          description: profile.description,
          power: profile.power.join(', '), // Преобразование массива в строку
        });
      } else {
        // Если профиль ещё не загружен, вызываем getMe() для загрузки профиля
        this.profileService.getMe().subscribe({
          next: (profile) => {
            this.form.patchValue({
              firstName: profile.name.split(' ')[0] || '',
              lastName: profile.name.split(' ')[1] || '',
              username: profile.username,
              description: profile.description,
              power: profile.power.join(', '),
            });
          },
          error: (err) => {
            console.error('Error loading profile', err);
          },
        });
      }
    });
  }

  async onSave() {
    console.log('Button clicked'); // Диагностика нажатия кнопки
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    console.log('Form valid:', this.form.valid); // Проверка валидности формы
    console.log('Form value:', this.form.value); // Проверка данных формы

    if (this.form.invalid) return;

    try {
      const firstName = this.form.value.firstName || '';
      const lastName = this.form.value.lastName || '';
      const description = this.form.value.description || '';
      const powerString = this.form.value.power || '';

      const updatedProfile = {
        name: `${firstName} ${lastName}`,
        description: description,
        power: powerString.split(',').map((p) => p.trim()),
      };

      console.log('Отправка профиля:', updatedProfile); // Проверка данных перед отправкой

      const result = await firstValueFrom(
        this.profileService.patchProfile(updatedProfile)
      );
      console.log('Profile updated successfully:', result);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
