import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  searchForm = this.fb.group({
    nickname: [''],
    power: [''],
  });
  constructor() {
    // this.searchForm.
  }
}
