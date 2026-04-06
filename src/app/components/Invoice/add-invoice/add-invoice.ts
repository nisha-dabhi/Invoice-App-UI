import { Component } from '@angular/core';
import { Invoice } from '../../../models/invoice';
import { CompanyService } from '../../../services/company-service';
import { InvoiceService } from '../../../services/invoice-service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-invoice',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-invoice.html',
  styleUrl: './add-invoice.css',
})
export class AddInvoice {
  invoice: Invoice = {} as Invoice;
  invoices: Invoice[] = [];
  isEdit = false;
  companies: { id: number; companyName: string }[] = [];
  clients: any[] = [];
  showForm = true;
  detInvoice: Invoice | null = null;
  showDetail = false;

  constructor(private companyService: CompanyService,
              private clientService: ClientService,
              private invoiceService: InvoiceService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.loadInvoices();
    this.loadCompanies();
    this.loadClients();
  }

  loadCompanies() {
    this.companyService.getAllCompany().subscribe({
      next: data => this.companies = data,
      error: err => console.error(err)
    });
  }

  loadClients() {
    this.clientService.getAllClients().subscribe({
      next: data => this.clients = data,
      error: err => console.error(err)
    });
  }

  loadInvoices() {
    this.invoiceService.getAllInvoice().subscribe({
      next: data => this.invoices = data,
      error: err => console.error(err)
    });
  }

  getCompanyName(id: number) {
    const company = this.companies.find(c => c.id === id);
    return company ? company.companyName : 'N/A';
  }

  getClientName(id: number) {
    const client = this.clients.find(c => c.id === id);
    return client ? client.clientName : 'N/A';
  }

  openForm() {
    this.showForm = true;
    this.isEdit = false;
  }

  closeCard() {
    this.showForm = false;
  }

  addInvoice() {
    if (this.isEdit) {
      this.invoiceService.updateInvoice(this.invoice.id, this.invoice).subscribe({
        next: () => {
          alert('Updated Successfully');
          this.toastr.success('Invoice data updated successfully!', 'Updated');
          this.loadInvoices();
        }
      });
    } else {
      this.invoiceService.addInvoice(this.invoice).subscribe({
        next: () => {
          alert('Saved Successfully');
          this.toastr.success('New Data added successfully!', 'Success');
          this.loadInvoices();
        }
      });
    }
  }

  editInvoice(inv: Invoice) {
    this.invoice = { ...inv };
    this.isEdit = true;
    this.showForm = true;
  }

  deleteInvoice(id: number) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.invoiceService.deleteInvoice(id).subscribe({
        next: () => {
          alert('Deleted Successfully');
          this.toastr.error('Invoice data deleted!', 'Deleted');
          this.loadInvoices();
        }
      });
    }
  }

  openModal(invoice: Invoice) {
    this.detInvoice = invoice;
    this.showDetail = true;
  }

  closeModal() {
    this.detInvoice = null;
    this.showDetail = false;
  }

  resetForm() {
    this.invoice = {} as Invoice;
  }
}