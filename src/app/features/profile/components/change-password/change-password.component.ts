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

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  changePasswordForm!: FormGroup;
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.createForm();
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
