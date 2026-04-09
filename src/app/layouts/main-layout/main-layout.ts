import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule ,RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {

  user: any;

  constructor(private login: LoginService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    const data = localStorage.getItem('user');
    this.user = data ? JSON.parse(data) : null;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {

      this.login.logout();

      this.toastr.success('Logged out successfully', 'Success');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    }
  }
}
