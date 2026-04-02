import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ClientService } from '../../../services/client-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-client-details',
  imports: [DatePipe,RouterLink],
  templateUrl: './client-details.html',
  styleUrl: './client-details.css',
})
export class ClientDetails implements OnInit {
  client: any;

  constructor(private route: ActivatedRoute,private clientService: ClientService,private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.clientService.getClientDetails(+params.get('id')!))
    ).subscribe(client => this.client = client);
  }

  closeCard() 
  {
    this.router.navigate(['/client']);
  }
}
