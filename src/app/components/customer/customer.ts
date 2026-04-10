import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from '../../services/company-service';
import { CustomerService } from '../../services/customer-service';
import { Router } from '@angular/router';
import { Customer } from '../../models/customer';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class AddCustomer implements OnInit {

  customerForm!: FormGroup;
  isEdit = false;
  editId!: number;
  customers: Customer[] = [];
  companies: { id: number; companyName: string }[] = [];
  companyName: string = '';
  detailCustomer: Customer | null = null;
  showDetail = false;
  showForm = true;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private service: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCustomers();
    this.loadCompanies();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      billTo: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      compId: ['', Validators.required],
      companyName:  [''],
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() { return this.customerForm.controls; }

  loadCustomers(): void {
    this.service.getAllCustomers().subscribe(res => {
      this.customers = res;
    });
  }

  loadCompanies(): void {
    this.companyService.getAllCompany().subscribe({
      next: (data) => this.companies = data,
      error: (err) => console.error('Failed to load companies', err)
    });
  }

  addCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    const selectedId = this.customerForm.get('compId')?.value;
    const comp = this.companies.find(c => c.id == selectedId);

    const formValue: Customer = {
      ...this.customerForm.value,
      companyName: comp ? comp.companyName : ''
    };
    if (this.isEdit) {
      this.service.updateCustomer(this.editId, { ...formValue, id: this.editId }).subscribe(() => {
        this.toastr.success('Customer updated successfully!', 'Updated');
        this.loadCustomers();
        this.closeCard();
      });
    } else {
      this.service.addCustomer(formValue).subscribe(() => {
        this.toastr.success('Customer added successfully!', 'Success');
        this.loadCustomers();
        this.closeCard();
      });
    }
  }

  updateCustomer(c: Customer): void {
    this.isEdit = true;
    this.showForm = true;
    this.editId = c.id;
    this.customerForm.patchValue({
      customerName: c.customerName,
      billTo: c.billTo,
      phone: c.phone,
      email: c.email,
      compId: c.compId,
      companyName:  c.companyName,
      address: c.address
    });
    this.onCompIdChange();
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteCustomer(id).subscribe(() => {
        alert('Customer deleted  Successfully');
        this.toastr.error('Customer deleted!', 'Deleted');
        this.loadCustomers();
      });
    }
  }

  openForm(): void {
    this.showForm = true;
    this.isEdit = false;
    this.customerForm.reset();
    this.companyName = '';
  }

  openModal(customer: Customer): void {
    this.detailCustomer = customer;
    this.showDetail = true;
  }

  closeModal(): void {
    this.detailCustomer = null;
    this.showDetail = false;
  }

  closeCard(): void {
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.customerForm.reset();
    this.isEdit = false;
    this.companyName = '';
  }

  onCompIdChange(): void {
    const selectedId = this.customerForm.get('compId')?.value;
    const comp = this.companies.find(c => c.id == selectedId);
    this.companyName = comp ? comp.companyName : '';
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ?? event.keyCode;
    const input = event.target as HTMLInputElement;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    if (input.value.length >= 10) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}