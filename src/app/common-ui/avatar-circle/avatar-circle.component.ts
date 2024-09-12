import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
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
  me: Profile | null = null;
  private route = inject(ActivatedRoute);
  constructor(private profileService: ProfileService) {}
  @Input() avatar!: string; // Принимаем ссылку на аватар
  ngOnInit(): void {
    this.me = this.profileService.me;
  }
  profile$: Observable<Profile | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id
        ? this.profileService.getAccount(id)
        : this.profileService.getMe();
    })
  );
}
