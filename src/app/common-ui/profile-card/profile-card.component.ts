import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { environment } from '../../../environments/environment';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent implements OnInit {
  @Input() profile: Profile | undefined;
  profileService = inject(ProfileService);
  @Input() isSubscribed: boolean = false; // Устанавливаем true, так как мы предполагаем, что пользователь уже подписан
  @Output() cardRemoved = new EventEmitter<string>();

  ngOnInit() {}

  toggleSubscription(): void {
    if (this.isSubscribed) {
      this.unsubscribe();
    } else {
      this.subscribe();
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/404.svg';
  }

  subscribe() {
    if (this.profile) {
      this.profileService.subscribeToProfile(this.profile._id).subscribe({
        next: () => {
          this.isSubscribed = true;
          this.profileService.updateSubscribers();
          setTimeout(() => {
            this.cardRemoved.emit(this.profile?._id);
          }, 300);
        },
        error: (err) => {
          console.error('Error subscribing to profile:', err);
        },
      });
    }
  }

  unsubscribe() {
    if (this.profile) {
      this.profileService.unsubscribeFromProfile(this.profile._id).subscribe({
        next: () => {
          this.isSubscribed = false;
          this.profileService.updateSubscribers();
          setTimeout(() => {
            this.cardRemoved.emit(this.profile?._id);
          }, 300);
        },
        error: (err) => {
          console.error('Error unsubscribing from profile:', err);
        },
      });
    }
  }

  get avatarUrl(): string {
    return this.profile
      ? `${environment.assetsUrl}/${this.profile.avatar}`
      : '';
  }
}
