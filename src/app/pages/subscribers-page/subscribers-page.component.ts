import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileCardComponent } from '../../common-ui/profile-card/profile-card.component';
import { SubscriberCardComponent } from '../../common-ui/sidebar/subscriber-card/subscriber-card.component';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  selector: 'app-subscribers-page',
  standalone: true,
  imports: [ProfileCardComponent, CommonModule, SubscriberCardComponent],
  templateUrl: './subscribers-page.component.html',
  styleUrls: ['./subscribers-page.component.scss'],
})
export class SubscribersPageComponent implements OnInit {
  profileService = inject(ProfileService);
  subscribers$: Observable<Profile[]> =
    this.profileService.getSubscribersLongList();
  profiles: Profile[] = [];
  onCardRemoved(profileId: string) {
    this.profiles = this.profiles.filter(
      (profile) => profile._id !== profileId
    );
  }
  ngOnInit() {
    this.subscribers$.subscribe((profiles) => (this.profiles = profiles));
    this.loadSubscribers();
  }

  loadSubscribers() {
    this.subscribers$.subscribe({
      next: (subscribers$) => {
        // обновляем список подписчиков
      },
      error: (err) => {
        console.error('Error loading subscribers:', err);
      },
    });
  }

  trackById(index: number, profile: Profile): string {
    return profile._id;
  }
  isUserSubscribed(userId: string): boolean {
    return (
      this.profileService.me?.subscribers.some((sub) => sub._id === userId) ||
      false
    );
  }
}
