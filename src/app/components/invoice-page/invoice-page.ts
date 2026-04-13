import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillInfoService } from '../../services/bill-info-service';
import { BillService } from '../../services/bill-service';
import { Bill } from '../../models/bill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-page',
  imports: [CommonModule],
  templateUrl: './invoice-page.html',
  styleUrl: './invoice-page.css',
})
export class InvoicePage implements OnInit {

  private router          = inject(Router);
  private route           = inject(ActivatedRoute);
  private billService     = inject(BillService);
  private billInfoService = inject(BillInfoService);

  invoiceId:   number = 0;
  invoiceNo:   string = '';
  billInfo:    any    = null;
  billItems:   Bill[] = [];

  shipping:    number = 100;
  subtotal:    number = 0;
  discountVal: number = 0;
  taxVal:      number = 0;
  total:       number = 0;

  ngOnInit(): void {
    const id       = this.route.snapshot.paramMap.get('invoiceNo');
    this.invoiceId = id ? +id : 0;

    if (this.invoiceId) {
      this.loadBillInfo(this.invoiceId);
    }
  }

  loadBillInfo(id: number): void {
    this.billInfoService.getBillInfoDetails(id).subscribe({
      next: (data: any) => {
        this.billInfo  = data;
        this.invoiceNo = data.invoiceNo;
        console.log('billInfo:', this.billInfo);
        this.loadBillItems(this.invoiceNo);
      },
      error: (err) => console.error('Error loading bill info:', err)
    });
  }

  loadBillItems(invoiceNo: string): void {
    this.billService.getAllBill().subscribe({
      next: (data: Bill[]) => {
        this.billItems = data.filter(b => b.invoiceNo === invoiceNo);
        this.calculateSummary();
        console.log('billItems:', this.billItems);
      },
      error: (err) => console.error('Error loading bill items:', err)
    });
  }

  getSubtotal(): number {
    return this.billItems.reduce((sum, b) => sum + (b.price * b.quantity), 0);
  }

  getDiscount(): number {
    return this.billItems.reduce((sum, b) => {
      return sum + ((b.price * b.quantity) * (b.disc ?? 0) / 100);
    }, 0);
  }

  getTax(): number {
    return this.billItems.reduce((sum, b) => {
      const base = b.price * b.quantity;
      return sum + ((base - (base * (b.disc ?? 0) / 100)) * (b.tax ?? 0) / 100);
    }, 0);
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount() + this.getTax() + this.shipping;
  }

  calculateSummary(): void {
    this.subtotal    = this.getSubtotal();
    this.discountVal = this.getDiscount();
    this.taxVal      = this.getTax();
    this.total       = this.getTotal();
  }

  backToList(): void {
    this.router.navigate(['/billInfo']);
  }
}