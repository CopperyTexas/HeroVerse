import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Profile } from '../../../data/interfaces/profile.interface';

@Component({
  selector: 'app-subscriber-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
})
export class SubscriberCardComponent {
  @Input() profile!: Profile;
  ngOnInit() {
    console.log('Profile data:', this.profile);
  }
  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/404.svg';
  }
}
