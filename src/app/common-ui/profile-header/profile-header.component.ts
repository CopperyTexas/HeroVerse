import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent {
  profile = input<Profile>();
}
