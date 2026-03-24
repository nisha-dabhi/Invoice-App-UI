import { Component } from '@angular/core';
import { InvoiceItem } from '../../InvoiceItem';
import { CommonModule, DecimalPipe, NgOptimizedImage } from '@angular/common';


@Component({
  selector: 'app-in-voice',
   standalone: true,
  imports: [DecimalPipe, CommonModule,NgOptimizedImage],
  templateUrl: './in-voice.html',
  styleUrl: './in-voice.css',
})
export class InvoiceComponent {
  invoiceItems: InvoiceItem[] = [
    { description: 'Phone', rate: 10000, quantity: 1, discount: 10, tax: 6, amount: 9540 },
    { description: 'Earbuds', rate: 2000, quantity: 1, discount: 5, tax: 3, amount: 1957 }
  ];

  shipping: number = 100;

getSubtotal(): number {
  return this.invoiceItems.reduce((sum, item) => {
    return sum + (item.rate * item.quantity);
  }, 0);
}

getDiscount(): number {
  return this.invoiceItems.reduce((sum, item) => {
    const base = item.rate * item.quantity;
    return sum + (base * item.discount / 100);
  }, 0);
}

getTax(): number {
  return this.invoiceItems.reduce((sum, item) => {
    const base = item.rate * item.quantity;
    const afterDiscount = base - (base * item.discount / 100);
    return sum + (afterDiscount * item.tax / 100);
  }, 0);
}

getTotal(): number {
  return this.getSubtotal() - this.getDiscount() + this.getTax() + this.shipping;
}

subtotal = 0;
discountVal = 0;
taxVal = 0;
total = 0;

ngOnInit() {
  this.calculateSummary();
}

calculateSummary() {
  this.subtotal = this.getSubtotal();
  this.discountVal = this.getDiscount();
  this.taxVal = this.getTax();
  this.total = this.getTotal();
}

  // subtotal = 960.00;
  // discountVal = 95.40;
  // taxVal = 95.40;
  // shipping = 100.00;
  // total = 1054.00;
}
