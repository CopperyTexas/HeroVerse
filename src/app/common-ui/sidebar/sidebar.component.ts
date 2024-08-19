import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    SubscriberCardComponent,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  profileService = inject(ProfileService);
  subscribers$ = this.profileService.getSubscribersShortList();
  me = this.profileService.getMe();
  menuItems = [
    { label: 'Home page', icon: 'home', link: '' },
    { label: 'Chats', icon: 'message', link: 'chats' },
    { label: 'Search', icon: 'search', link: 'search' },
  ];
  // Метод trackById для *ngFor
  trackById(index: number, profile: Profile): number {
    return profile.id;
  }
  ngOnInit() {
    console.log('ngOnInit');
    firstValueFrom(this.profileService.getMe());
  }
}
