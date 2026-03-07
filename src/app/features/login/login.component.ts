import { AfterViewInit, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  // Services
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  // flowBite logic
  ngAfterViewInit(): void {
    initFlowbite();
  }

  loginForm: FormGroup = this.formBuilder.nonNullable.group({
    login: ['', [Validators.required, Validators.minLength(3)]],

    password: [
      '',
      [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ],
    ],
  });

  submitForm(): void {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);

          // Save Token and User in local storage
          localStorage.setItem('socialToken', res.data.token);
          localStorage.setItem('socialUser', JSON.stringify(res.data.user));

          // navigate feed page
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  showPassword(element: HTMLInputElement): void {
    if (element.type == 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }
}
