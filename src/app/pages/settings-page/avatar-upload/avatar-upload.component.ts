import { Component, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective],
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss'],
})
export class AvatarUploadComponent {
  preview = signal<string>('/assets/images/404.svg');
  avatar: File | null = null;
  profileService = inject(ProfileService);

  fileBrowserHandler(event: Event) {
    const file: File | null =
      (event.target as HTMLInputElement)?.files?.[0] || null;
    this.processFile(file);
  }

  onFileDropped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null) {
    if (!file || !/^image\//.test(file.type)) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };
    reader.readAsDataURL(file);
    this.avatar = file;
  }

  async uploadAvatar() {
    if (!this.avatar) {
      console.log('No avatar to upload');
      return;
    }
    console.log('Uploading avatar:', this.avatar);

    try {
      const result = await firstValueFrom(
        this.profileService.uploadAvatar(this.avatar)
      );
      console.log('Avatar uploaded successfully:', result);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  }
}
