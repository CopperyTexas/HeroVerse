import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);
  form = new FormGroup({
    username: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  });
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      // Преобразуем значения, если они не null или undefined
      const username = formValue.username ?? '';
      const password = formValue.password ?? '';

      if (username && password) {
        this.authService.login({ username, password }).subscribe(
          (response) => {
            console.log(
              'Login successful, tokens set:',
              this.authService.token
            );
            this.router.navigate(['']);
          },
          (error) => {
            console.log('Login failed:', error);
          }
        );
      }
    }
  }
  goToStorySet(event: MouseEvent) {
    (event.target as HTMLElement).blur();
    window.open('https://storyset.com', '_blank');
  }
}
