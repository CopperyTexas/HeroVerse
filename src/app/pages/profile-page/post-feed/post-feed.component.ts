import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Post } from '../../../data/interfaces/post.interface';
import { PostService } from '../../../data/services/post.service';
import { PostInputComponent } from '../post-input/post-input.component';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [PostInputComponent, PostComponent, CommonModule],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent {
  postService = inject(PostService);
  feed = this.postService.posts;
  trackByPostId(index: number, post: Post): string {
    return post._id || index.toString(); // Используем _id или fallback на индекс, если _id нет
  }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }
}
