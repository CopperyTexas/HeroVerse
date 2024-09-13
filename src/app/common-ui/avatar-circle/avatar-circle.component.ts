import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-avatar-circle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-circle.component.html',
  styleUrl: './avatar-circle.component.scss',
})
export class AvatarCircleComponent implements OnInit {
  @Input() avatar?: string; // Делаем avatar опциональным
  defaultAvatar = '/assets/images/404.svg';
  currentUserAvatar?: string;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    if (!this.avatar) {
      // Если avatar не передан, используем аватар текущего пользователя
      const me: Profile | null = this.profileService.me;
      if (me && me.avatar) {
        this.currentUserAvatar = me.avatar;
      } else {
        this.currentUserAvatar = this.defaultAvatar;
      }
    }
  }
}
