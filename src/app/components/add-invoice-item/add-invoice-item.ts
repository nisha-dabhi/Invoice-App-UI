import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { CompanyService } from '../../services/company-service';
import { ClientService } from '../../services/client-service';
import { ProductService } from '../../services/product-service';
import { InvoiceItemService } from '../../services/invoice-item-service';
import { FormsModule, NgForm } from '@angular/forms';
import { InvoiceItem } from '../../models/invoice-item';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { Client } from '../../models/client';
import { Company } from '../../models/company';
import { Product } from '../../models/product';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-invoice-item',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-invoice-item.html',
  styleUrls: ['./add-invoice-item.css'],
})
export class AddInvoiceItem {

  @ViewChild('invoiceItemForm') invoiceItemForm!: NgForm;

  constructor(private toastr: ToastrService, private router: Router, private route: ActivatedRoute) { }

  private companyService = inject(CompanyService);
  private clientService = inject(ClientService);
  private productService = inject(ProductService);
  private invoiceService = inject(InvoiceService);
  private invoiceItemService = inject(InvoiceItemService);

  companies: Company[] = [];
  clients: Client[] = [];
  products: Product[] = [];
  invoices: Invoice[] = [];
  invoiceItems: InvoiceItem[] = [];

  invoiceItem: InvoiceItem = {} as InvoiceItem;

  showForm = true;
  isEdit = false;

  companyName: string = '';

  groupedItems: { key: string, items: InvoiceItem[] }[] = [];

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCompanies();
    this.loadClients();
    this.loadProducts();
    this.loadInvoiceItems();
  }

  loadInvoices() {
    this.invoiceService.getAllInvoice().subscribe(res => this.invoices = res);
  }

  loadCompanies() {
    this.companyService.getAllCompany().subscribe(res => {
      this.companies = res;
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe(res => {
      this.clients = res;
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(res => this.products = res);
  }

  loadInvoiceItems() {
    debugger
    this.invoiceItemService.getAllInvoiceItem().subscribe(res => {
      this.invoiceItems = res;
      this.buildGroups();
    });
  }

  onProductChange() {
    const p = this.products.find(x => x.id === this.invoiceItem.prodId);
    if (p) {
      this.invoiceItem.productName = p.productName;
      this.invoiceItem.price = p.price;
      this.calculateAmount();
    }
  }

  onInvoiceNoChange() {
    const inv = this.invoices.find(x => x.id === this.invoiceItem.invoiceId);
    if (inv) {
      this.invoiceItem.invoiceNo = inv.invoiceNo;
      this.invoiceItem.compId = inv.compId;
      this.invoiceItem.clientId = inv.clientId;

    }
  }

  calculateAmount(): number {
    const total = (this.invoiceItem.price || 0) * (this.invoiceItem.quantity || 0);
    const discount = total * ((this.invoiceItem.disc || 0) / 100);
    const tax = total * ((this.invoiceItem.tax || 0) / 100);
    this.invoiceItem.amount = total - discount + tax;
    return this.invoiceItem.amount;
  }

  editItem(item: InvoiceItem) {
    this.isEdit = true;
    this.showForm = true;
    this.invoiceItem = { ...item };
  }

  addInvoiceItems() {
    if (this.isEdit) {
      this.invoiceItemService.updateInvoiceItem(this.invoiceItem.id, this.invoiceItem)
        .subscribe(() => {
          alert('Updated Successfully');
          this.toastr.success('Updated successfully!', 'Updated');
          this.loadInvoiceItems();
          this.resetForm();
        });
    } else {
      this.invoiceItemService.addInvoiceItems([this.invoiceItem])
        .subscribe({
          next: () => {
            alert('Data Saved Successfully');
            this.toastr.success('Saved successfully!', 'Success');
            this.loadInvoiceItems();
            this.resetForm();
          },
          error: (err) => {
            console.error('API Error', err);
            this.toastr.error('Failed to save!', 'Error');
          }
        });
    }
  }

  get selectedCompanyName(): string {
    return this.companies.find(c => c.id === this.invoiceItem.compId)?.companyName ?? '';
  }

  get selectedClientName(): string {
    return this.clients.find(c => c.id === this.invoiceItem.clientId)?.clientName ?? '';
  }

  goToInvoice(invoiceId: number) {
    this.router.navigate(['/invoice', invoiceId]);
  }

  resetForm() {
    this.invoiceItemForm.resetForm();
    this.invoiceItem = {} as InvoiceItem;
    this.isEdit = false;
  }

  removeItem(item: InvoiceItem) {
    if (confirm('Are you sure you want to delete this item?')) {
      this.invoiceItemService.deleteInvoiceItem(item.id).subscribe({
        next: () => {
          this.toastr.success('Item deleted successfully!', 'Deleted');
          const index = this.invoiceItems.indexOf(item);
          if (index > -1) {
            this.invoiceItems.splice(index, 1);
            this.buildGroups();
          }
        },
        error: () => this.toastr.error('Failed to delete item!', 'Error')
      });
    }
  }

  closeCard() { this.showForm = false; }
  openForm() { this.showForm = true; this.isEdit = false; }

  buildGroups() {
    const groups: { [key: string]: InvoiceItem[] } = {};
    this.invoiceItems.forEach(item => {
      if (!groups[item.invoiceNo]) groups[item.invoiceNo] = [];
      groups[item.invoiceNo].push(item);
    });
    this.groupedItems = Object.keys(groups).map(key => ({ key, items: groups[key] }));
  }

}