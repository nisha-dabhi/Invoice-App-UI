import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class AddRegister {

  registerForm!: FormGroup;

  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      companyName: ['', Validators.required],
      companyEmail: ['', [Validators.required, Validators.email]],
      companyPhone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  register() {
    if (this.registerForm.invalid) return;

    const form = this.registerForm.value;

    form.email = form.email?.toLowerCase().trim();
    form.companyEmail = form.companyEmail?.toLowerCase().trim();

    this.service.register(form).subscribe({
      next: () => {
        alert('Registered Successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message);
      }
    });
  }
  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}