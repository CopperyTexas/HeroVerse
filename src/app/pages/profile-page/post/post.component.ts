import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { Post } from '../../../data/interfaces/post.interface';
import { Profile } from '../../../data/interfaces/profile.interface';
import { PostService } from '../../../data/services/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AvatarCircleComponent, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post!: Post; // Получаем объект поста через Input
  profile: Profile | null = null; // Здесь будут данные автора
  posts: Post[] = [];
  postService = inject(PostService);

  ngOnInit(): void {
    // Загружаем посты при инициализации компонента
    this.postService.fetchPosts().subscribe((posts) => {
      this.posts = posts; // Сохраняем посты
    });
  }
}
