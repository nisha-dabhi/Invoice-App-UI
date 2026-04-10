import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

import { CommonModule, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { InvoiceService } from '../../services/invoice-service';
import { InvoiceItemService } from '../../services/invoice-item-service';
import { Invoice } from '../../models/invoice';
import { InvoiceItem } from '../../models/invoice-item';

@Component({
  selector: 'app-in-voice',
  standalone: true,
  imports: [DecimalPipe, CommonModule, NgOptimizedImage ],
  templateUrl: './in-voice.html',
  styleUrls: ['./in-voice.css']
})
export class InvoiceComponent {
 
  constructor(private router: Router, private route: ActivatedRoute) {}

  private _route = inject(ActivatedRoute);
  private _invoiceService = inject(InvoiceService);
  private _invoiceItemService = inject(InvoiceItemService);

  invoiceId: number = 0;
  invoice?: Invoice;
  invoiceItems: InvoiceItem[] = [];

  shipping: number = 100;

  subtotal = 0;
  discountVal = 0;
  taxVal = 0;
  total = 0;

  ngOnInit(): void {
    const idStr = this._route.snapshot.paramMap.get('invoiceId');
    this.invoiceId = idStr ? +idStr : 0;

    if (this.invoiceId) {
      this.loadInvoice(this.invoiceId);
      this.loadInvoiceItems(this.invoiceId);
    }
  }

  loadInvoice(id: number) {
    this._invoiceService.getAllInvoice().subscribe({
      next: (data) => {
        this.invoice = data.find(inv => inv.id === id);
        if (!this.invoice) {
          console.error('Invoice not found for id:', id);
        } else {
          console.log('Invoice loaded:', this.invoice);
        }
      },
      error: (err) => console.error('Error loading invoices:', err)
    });
  }

  loadInvoiceItems(id: number) {
    this._invoiceItemService.getInvoiceById(id).subscribe({
      next: (data: any) => {
        this.invoiceItems = data;
        console.log(this.invoiceItems);
      },
      error: (err) => console.error(err)
    });
  }

  getSubtotal(): number {
    return this.invoiceItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDiscount(): number {
    return this.invoiceItems.reduce((sum, item) => sum + ((item.price * item.quantity) * item.disc / 100), 0);
  }

  getTax(): number {
    return this.invoiceItems.reduce((sum, item) => {
      const base = item.price * item.quantity;
      return sum + ((base - (base * item.disc / 100)) * item.tax / 100);
    }, 0);
  }

  getTotal(): number {
    const shipping = 100;
    return this.getSubtotal() - this.getDiscount() + this.getTax() + shipping;
  }

  calculateSummary() {
    this.subtotal = this.getSubtotal();
    this.discountVal = this.getDiscount();
    this.taxVal = this.getTax();
    this.total = this.getTotal();
  }
 

   backToList() {
    this.router.navigate(['/addItem'], { relativeTo: this.route });
  }
}