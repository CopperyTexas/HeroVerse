import { CommonModule } from '@angular/common';
import { Component, Renderer2, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { Profile } from '../../../data/interfaces/profile.interface';
import { PostService } from '../../../data/services/post.service';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [CommonModule, AvatarCircleComponent, SvgIconComponent, FormsModule],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss',
})
export class PostInputComponent {
  r2 = inject(Renderer2);
  postService = inject(PostService);
  profileService = inject(ProfileService);
  postText = '';
  profile: Profile | null = null; // Храним профиль текущего пользователя

  constructor() {
    // Загружаем профиль текущего пользователя
    this.profileService.getMe().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => {
        console.error('Ошибка при загрузке профиля:', err);
      },
    });
  }

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText || !this.profile) return; // Убедись, что профиль загружен
    this.postService
      .createPost({
        title: 'Post', // Можешь заменить на динамическое значение
        content: this.postText,
        authorId: this.profile._id, // Используем ID текущего пользователя
      })
      .subscribe({
        next: (response) => {
          console.log('Пост успешно создан:', response);
          this.postText = ''; // Очищаем текст после отправки
        },
        error: (error) => {
          console.error('Ошибка при создании поста:', error);
        },
      });
  }
}
