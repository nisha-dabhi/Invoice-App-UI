import { Component } from '@angular/core';
import { LoginService } from '../services/login-service';
import { Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule , CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loginData = {
    email: '',
    password: ''
  };

  constructor(private login: LoginService, private router: Router) {}

  onLogin(form: any) {
    if (form.invalid) return;

    this.login.login(this.loginData).subscribe({
      next: (res) => {

        localStorage.setItem('token', res.token);

        localStorage.setItem('user', JSON.stringify(res.user));

        console.log('Login success:', res);

        this.router.navigate(['/addInvoice']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error.message || 'Login failed');
      }
    });
  }
}