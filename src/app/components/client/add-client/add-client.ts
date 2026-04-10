import { Component } from '@angular/core';
import { Client } from '../../../models/client';
import { ClientService } from '../../../services/client-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-client',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-client.html',
  styleUrl: './add-client.css',
})
export class AddClient {

  client: Client = {} as Client;
  isEdit = false;
  clients: Client[] = [];
  companies: { id: number; companyName: string }[] = [];
  companyName: string = '';
  detailClient: Client | null = null;
  showDetail = false;
  showForm = true;

  constructor(private companyService: CompanyService, private service: ClientService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadClients();
    this.loadCompanies();
  }

  loadClients() {
    this.service.getAllClients().subscribe(res => {
      this.clients = res;
    });
  }

  loadCompanies(): void {
    this.companyService.getAllCompany().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Failed to load companies', err);
      }
    });
  }

  addClient() {
    if (this.isEdit) {
      this.service.updateClient(this.client.id, this.client).subscribe(() => {
        alert('Updated Successfully');
        this.toastr.success('Client updated successfully!', 'Updated');
        this.loadClients();
      });
    } else {
      this.service.addClient(this.client).subscribe(() => {
        alert('Saved Successfully');
        this.toastr.success('Client added successfully!', 'Success');
        this.loadClients();
      });
    }
  }

  deleteClient(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteClient(id).subscribe(() => {
        alert('Deleted Successfully');
        this.toastr.error('Client deleted!', 'Deleted');
        this.loadClients();
      });
    }
  }

  updateClient(c: any) {
    this.client = { ...c };
    this.isEdit = true;
  }
  openForm() {
    this.showForm = true;
    this.client = {} as Client;
    this.isEdit = false;
  }


  openModal(client: Client) {
    this.detailClient = client;
    this.showDetail = true;
  }

  closeModal() {
    this.detailClient = null;
    this.showDetail = false;
  }

  today: string = new Date().toISOString().split('T')[0];


  onlyNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }

    if (event.target.value.length >= 10) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  closeCard() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.client = {} as Client;
    this.isEdit = false;
  }

  onCompIdChange() {
    const comp = this.companies.find(c => c.id === this.client.compId);
    this.companyName = comp ? comp.companyName : '';
  }

}
