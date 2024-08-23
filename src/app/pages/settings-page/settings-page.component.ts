import { Component, ViewChild, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { ProfileService } from '../../data/services/profile.service';
import { AvatarUploadComponent } from './avatar-upload/avatar-upload.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ProfileHeaderComponent, ReactiveFormsModule, AvatarUploadComponent],
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
})
export class SettingsPageComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  @ViewChild(AvatarUploadComponent) avatarUploader!: AvatarUploadComponent;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: [{ value: '', disabled: true }, Validators.required],
    nickname: ['', Validators.required],
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
          nickname: profile.nickname,
          description: profile.description,
          power: profile.power.join(', '), // Преобразование массива в строку
        });
      } else {
        this.profileService.getMe().subscribe({
          next: (profile) => {
            this.form.patchValue({
              firstName: profile.name.split(' ')[0] || '',
              lastName: profile.name.split(' ')[1] || '',
              username: profile.username,
              nickname: profile.nickname,
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
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

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

      const profileResult = await firstValueFrom(
        this.profileService.patchProfile(updatedProfile)
      );

      if (this.avatarUploader.avatar) {
        await this.avatarUploader.uploadAvatar();
      }

      console.log('Profile updated successfully:', profileResult);
    } catch (error) {
      console.error('Error updating profile and avatar:', error);
    }
  }

  splitPower(power: string | null | string[] | undefined) {
    if (!power) return [];
    if (Array.isArray(power)) return power;

    return power.split(',');
  }

  mergePower(power: string | null | string[] | undefined) {
    if (!power) return '';
    if (Array.isArray(power)) return power.join(',');

    return power;
  }
}
