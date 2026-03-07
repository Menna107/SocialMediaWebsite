import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../../../core/services/user/user.service';
import { IchangePassword } from '../../../../core/models/ichange-password.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.createForm();
    this.themeMode();
  }

  // ^Create new form
  createForm(): void {
    this.changePasswordForm = new FormGroup(
      {
        password: new FormControl(null, [Validators.required]),
        newPassword: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          ),
        ]),
        rePassword: new FormControl(null, [Validators.required]),
      },
      { validators: this.passwordMatchValidator },
    );
  }

  // ^Check that password and confirm password are match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const rePassword = control.get('rePassword');

    if (newPassword && rePassword && newPassword.value !== rePassword.value) {
      rePassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  // ^ icon than show password
  showPassword(input: HTMLInputElement): void {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  bgColor: string = '#f9f9fb';
  themeMode() {
    const theme = localStorage.getItem('theme');

    if (theme === 'light' || theme === null) {
      this.bgColor = '#f9f9fb';
    } else if (theme === 'dark') {
      this.bgColor = '#1a1625';
    }
  }

  // ^submit new password
  submitChangePassword(): void {
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;

      const data: IchangePassword = {
        password: formValue.password,
        newPassword: formValue.newPassword,
      };

      this.userService.changePassword(data).subscribe({
        next: (res) => {
          console.log(res);

          this.changePasswordForm.reset();
          localStorage.removeItem('socialToken');

          Swal.fire({
            title: 'Password changed successfully!',
            text: 'Please login again',
            icon: 'success',
            background: this.bgColor,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }
}
