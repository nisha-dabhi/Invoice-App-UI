import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingService } from '../../services/setting-service';
import { UserSettings, CompanySettings } from '../../models/setting';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {

  user: any;
  activePanel: 'user' | 'company' | null = null;

  userForm!: FormGroup;
  companyForm!: FormGroup;

  initials: string = 'AA';

  toastVisible = false;
  toastMessage = '';

  isLoading = false;
  isSaving = false;

  showOld = false;
  showNew = false;
  showConfirm = false;

  dropdownOpen = false;

  constructor(
    private login: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private service: SettingService
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    this.user = data ? JSON.parse(data) : null;

    this.initForms();
    this.loadUser();
    this.loadCompany();

    document.addEventListener('click', () => {
      this.dropdownOpen = false;
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  initForms(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      oldPassword: [''],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    this.companyForm = this.fb.group({
      companyName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const oldPass = group.get('oldPassword')?.value;
    const newPass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;

    if (newPass) {
      if (!oldPass) {
        group.get('oldPassword')?.setErrors({ required: true });
      }

      if (newPass !== confirmPass) {
        group.get('confirmPassword')?.setErrors({ mismatch: true });
      }
    }

    return null;
  }

  loadUser(): void {
    this.isLoading = true;

    this.service.getUser().subscribe({
      next: (res: UserSettings) => {
        const fullName = `${res.firstName} ${res.lastName}`.trim();

        this.userForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          phone: res.phone,
          email: res.email
        });

        this.initials = this.getInitials(fullName);
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load user');
        this.isLoading = false;
      }
    });
  }

  loadCompany(): void {
    this.service.getCompany().subscribe({
      next: (res: CompanySettings) => {
        this.companyForm.patchValue({
          companyName: res.companyName,
          phone: res.phone,
          email: res.email,
          address: res.address
        });
      },
      error: () => {
        this.toastr.error('Failed to load company');
      }
    });
  }

  openPanel(type: 'user' | 'company'): void {
    this.activePanel = type;
  }

  closePanel(): void {
    this.activePanel = null;
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const form = this.userForm.value;

    const payload: any = {
      firstName: form.firstName || '',
      lastName: form.lastName || '',
      phone: form.phone || '',
      email: form.email || ''
    };

    if (form.newPassword) {
      payload.oldPassword = form.oldPassword;
      payload.newPassword = form.newPassword;
    }

    this.service.updateUser(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('User updated successfully');
        this.closePanel();
        this.loadUser();
      },
      error: (err) => {
        this.isSaving = false;
        this.toastr.error(err?.error?.message || 'Server error');
      }
    });
  }

  saveCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const payload: CompanySettings = this.companyForm.value;

    this.service.updateCompany(payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.toastr.success('Company updated successfully');
        this.closePanel();
      },
      error: () => {
        this.isSaving = false;
        this.toastr.error('Failed to update company');
      }
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.login.logout();
      this.toastr.success('Logged out successfully');
      setTimeout(() => this.router.navigate(['/login']), 100);
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(x => x.length > 0)
      .map(x => x[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }
}