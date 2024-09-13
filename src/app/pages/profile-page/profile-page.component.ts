import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { ProfileHeaderComponent } from '../../common-ui/profile-header/profile-header.component';
import { SubscriberCardComponent } from '../../common-ui/sidebar/subscriber-card/subscriber-card.component';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { PostInputComponent } from './post-input/post-input.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    CommonModule,
    RouterModule,
    SvgIconComponent,
    SubscriberCardComponent,
    PostFeedComponent,
    PostInputComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);

  profile$: Observable<Profile | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id
        ? this.profileService.getAccount(id)
        : this.profileService.getMe();
    })
  );
  isMyProfile$: Observable<boolean> = this.profile$.pipe(
    switchMap((profile) =>
      this.profileService
        .getMe()
        .pipe(map((me) => !!profile && !!me && profile._id === me._id))
    )
  );
  subscribers$ = this.profileService.subscribers$; // Используйте подписчиков из сервиса

  ngOnInit() {
    this.profile$.subscribe((profile) => {
      if (profile) {
        this.profileService.subscribeToProfile(profile._id);
      }
    });
  }

  trackById(index: number, profile: Profile): string {
    return profile._id;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/404.svg';
  }
}
