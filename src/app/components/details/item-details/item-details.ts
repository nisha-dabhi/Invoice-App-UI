import { Component, OnInit } from '@angular/core';
import { InvoiceItemService } from '../../../services/invoice-item-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-item-details',
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './item-details.html',
  styleUrl: './item-details.css',
})
export class ItemDetails implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute,private itemService: InvoiceItemService ,private router: Router ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => this.itemService.getItemDetails(+params.get('id')!))
    ).subscribe(item => this.item = item);
  }

  closeCard() 
  {
    this.router.navigate(['/item']);
  }
}

