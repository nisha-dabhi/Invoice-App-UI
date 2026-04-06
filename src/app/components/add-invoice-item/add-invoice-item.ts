import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { ClientService } from '../../services/client-service';
import { ProductService } from '../../services/product-service';
import { InvoiceItemService } from '../../services/invoice-item-service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InvoiceItem } from '../../models/invoice-item';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';

@Component({
  selector: 'app-add-invoice-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-invoice-item.html',
  styleUrl: './add-invoice-item.css',
})
export class AddInvoiceItem {

  private companyService = inject(CompanyService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
   private invoiceService = inject(InvoiceService);
  private invoiceItemService = inject(InvoiceItemService);
  private route = inject(ActivatedRoute);

  companies: any[] = [];
  clients: any[] = [];
  products: any[] = [];
  invoices: any[] = [];

  invoiceItems: InvoiceItem[] = [];

  invoiceId: number = 0;
  compId: number = 0;
  clientId: number = 0;

  selectedProdId: number = 0;
  productName: string = '';
  price: number = 0;
  quantity: number = 1;
  disc: number = 0;
  tax: number = 0;

  shipping: number = 100;

  subtotal = 0;
  discountVal = 0;
  taxVal = 0;
  total = 0;

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCompanies();
    this.loadClients();
    this.loadProducts();
  }

   loadInvoices() {
    this.invoiceService.getAllInvoice().subscribe(res => {
      this.invoices = res;
      if (this.invoices.length > 0) {
        this.invoiceId = this.invoices[0].id;
      }
    });
  }

  loadCompanies() {
    this.companyService.getAllCompany().subscribe(res => {
      this.companies = res;
      if (this.companies.length > 0) {
        this.compId = this.companies[0].id;
      }
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe(res => {
      this.clients = res;
      if (this.clients.length > 0) {
        this.clientId = this.clients[0].id;
      }
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(res => {
      this.products = res;
    });
  }

  onProductChange() {
    const p = this.products.find(x => x.id == this.selectedProdId);
    if (p) {
      this.productName = p.productName;
      this.price = p.price;
    }
  }

  calculateAmount(): number {
    const base = this.price * this.quantity;
    const discount = (base * this.disc) / 100;
    const afterDiscount = base - discount;
    const taxVal = (afterDiscount * this.tax) / 100;
    return afterDiscount + taxVal;
  }

  getInvoices(): void {
    this.invoiceItemService.getAllInvoiceItem().subscribe({
      next: (data) => {
        this.invoiceItems = data;
        console.log('Items loaded:', this.invoiceItems);
      },
      error: (err) => {
        console.error('Fetch error:', err);
      }
    });
  }

  addInvoiceItem() {
    if (this.invoiceItems.length === 0) {
      alert('Add product first');
      return;
    }

    this.invoiceItemService.addInvoiceItem(this.invoiceItems).subscribe({
      next: () => {
        alert('Saved successfully');
        this.invoiceItems = [];
        this.calculateSummary();
      }
    });
  }



  reset() {
    this.selectedProdId = 0;
    this.productName = '';
    this.price = 0;
    this.quantity = 1;
    this.disc = 0;
    this.tax = 0;
  }

  getSubtotal(): number {
    return this.invoiceItems.reduce((sum, x) => sum + (x.price * x.quantity), 0);
  }

  getDiscount(): number {
    return this.invoiceItems.reduce((sum, x) => {
      const base = x.price * x.quantity;
      return sum + (base * x.disc / 100);
    }, 0);
  }

  getTax(): number {
    return this.invoiceItems.reduce((sum, x) => {
      const base = x.price * x.quantity;
      const afterDiscount = base - (base * x.disc / 100);
      return sum + (afterDiscount * x.tax / 100);
    }, 0);
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount() + this.getTax() + this.shipping;
  }
  removeItem(index: number) {
    this.invoiceItems.splice(index, 1);
    this.calculateSummary();
  }

  calculateSummary() {
    this.subtotal = this.getSubtotal();
    this.discountVal = this.getDiscount();
    this.taxVal = this.getTax();
    this.total = this.getTotal();
  }


}


