import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  message: string = '';

  constructor(private auth: AuthService) {}

  onSubmit() {
    if (this.registerForm.valid) {
      this.auth.register(this.registerForm.value).subscribe({
        next: (res) => {
          this.message = "Registration success";
        },
        error: (err) => {
          console.error(err);
          this.message = "Registration failed";
        }
      });
    }
  }

}
