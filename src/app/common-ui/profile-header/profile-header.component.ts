import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {
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

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/404.svg';
  }

  ngOnInit() {}
}
