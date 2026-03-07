import { Component, AfterViewInit, OnInit, inject } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
})
export class SignUpComponent implements AfterViewInit {
  // Services:
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    { validators: [this.confirmPassword] },
  );

  ngAfterViewInit(): void {
    initFlowbite();
  }

  // ^ When user submit the form:
  submitForm(): void {
    if (this.registerForm.valid) {
      // Send data to BackEnd.
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);

          // navigate to login page
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }

    // any error mark the inputs as touched to show the error messages.
    else {
      this.registerForm.markAllAsTouched();
    }
  }

  // ^Confirm Password Logic:
  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (rePassword !== password && rePassword !== '') {
      group.get('rePassword')?.setErrors({ mismatch: true });
    }

    return null;
  }

  // ^Show and hide Password:
  showPassword(element: HTMLInputElement): void {
    if (element.type == 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }
}
