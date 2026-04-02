import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  imports: [RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute, private userService:UserService ,private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.userService.getUserDetails(+params.get('id')!))
    ).subscribe(user => this.user = user);
  }

  closeCard() 
  {
    this.router.navigate(['/user']);
  }
}
