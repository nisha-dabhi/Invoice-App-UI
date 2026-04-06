import { Component, inject } from '@angular/core';
import { CommonModule, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { CompanyService } from '../services/company-service';
import { Company } from '../models/company';
import { Client } from '../models/client';
import { ClientService } from '../services/client-service';
import { Invoice } from '../models/invoice'; 
import { InvoiceService } from '../services/invoice-service';

@Component({
  selector: 'app-in-voice',
  standalone: true,
  imports: [DecimalPipe, CommonModule, NgOptimizedImage ],
  templateUrl: './in-voice.html',
  styleUrl: './in-voice.css',
})
export class InvoiceComponent {

  private _clientService = inject(ClientService);
  private _companyService = inject(CompanyService);
  private _invoiceService = inject(InvoiceService);

  companies: Company[] = [];
  clients: Client[] = [];
  invoices: Invoice[] = [];

  shipping: number = 100; 

  // getSubtotal(): number {
  //   return this.invoices.reduce((sum, item) => {
  //     return sum + (item.rate * item.quantity);
  //   }, 0);
  // }

  // getDiscount(): number {
  //   return this.invoiceItems.reduce((sum, item) => {
  //     const base = item.rate * item.quantity;
  //     return sum + (base * item.discount / 100);
  //   }, 0);
  // } 

  // getTax(): number {
  //   return this.invoiceItems.reduce((sum, item) => {
  //     const base = item.rate * item.quantity;
  //     const afterDiscount = base - (base * item.discount / 100);
  //     return sum + (afterDiscount * item.tax / 100);
  //   }, 0);
  // }

  // getTotal(): number {
  //   return this.getSubtotal() - this.getDiscount() + this.getTax() + this.shipping;
  // }
  
  subtotal = 0;
  discountVal = 0;
  taxVal = 0;
  total = 0;

  ngOnInit(): void {
    this.getCompanies();
    this.getClients();
    this.getInvoices();
    // this.calculateSummary();
  }

  getCompanies(): void {
    this._companyService.getAllCompany().subscribe({
      next: (data) => {
        this.companies = data;
        console.log('Companies loaded:', this.companies);
      },
      error: (err) => {
        console.error('Fetch error:', err);
      }
    });
  }

  getClients(): void {
    this._clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        console.log('Clients loaded:', this.clients);
      },
      error: (err) => {
        console.error('Fetch error:', err);
      }
    });
  }

  getInvoices(): void{
     this._invoiceService.getAllInvoice().subscribe({
      next: (data) => {
        this.invoices = data;
        console.log('Items loaded:', this.invoices);
      },
      error: (err) => {
        console.error('Fetch error:', err);
      }
    });
  }


  // calculateSummary() {
  //   this.subtotal = this.getSubtotal();
  //   this.discountVal = this.getDiscount();
  //   this.taxVal = this.getTax();
  //   this.total = this.getTotal();
  // }

}
