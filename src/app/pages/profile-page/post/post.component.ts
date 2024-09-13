import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { Post } from '../../../data/interfaces/post.interface';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [AvatarCircleComponent, CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input() post!: Post; // Получаем объект поста через Input
}
