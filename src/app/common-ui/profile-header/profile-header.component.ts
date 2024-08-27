import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
  profileService = inject(ProfileService);
}
