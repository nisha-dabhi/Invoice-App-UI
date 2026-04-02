import { Component } from '@angular/core';
import { ProductService } from '../../../services/product-service';
import { OrderStatus, Product } from '../../../models/product';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct {

  product: Product = {} as Product;
  products: Product[] = [];
  filteredProducts: Product[] = [];

  showForm = false;
  isEdit = false;

  searchText = '';
  pageSizeOptions = [5, 10, 15, 20, 'All'];
  pageSize = 7;
  currentPage = 1;

  selectedStatus: OrderStatus[] = [];
  statusOptions: OrderStatus[] = ['Available', 'Low Stock', 'Stock Out', 'On the Way'];
  selectedProduct: Product | null = null;

  constructor(private service: ProductService, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.service.getAllProducts().subscribe(res => {
      this.products = res;
      this.applyFilters();
    });
  }

  onSubmit(form: NgForm) {
    if (!form || form.invalid) return;

    if (this.isEdit) {
      this.service.updateProduct(this.product.id, this.product).subscribe(() => {
        alert('Updated Successfully');
        this.toastr.success('Product updated successfully!', 'Updated');
        this.loadProducts();        
      });
    } else {
      this.service.addProduct(this.product).subscribe(() => {
        alert('Saved Successfully');
        this.toastr.success('Product added successfully!', 'Success');
        this.loadProducts();        
      });
    }
  }

  editProduct(p: Product) {
    this.product = { ...p };
    this.isEdit = true;
    this.showForm = true;
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteProduct(id).subscribe(() => {
        this.loadProducts();
        this.toastr.error('Product deleted!', 'Deleted');
      });
    }
  }

  openForm() {
    this.product = {} as Product;
    this.isEdit = false;
    this.showForm = true;
  }

  closeCard() {
    this.showForm = false;
    this.isEdit = false;
    this.product = {} as Product;
  }

  resetForm() {
      this.product = {} as Product;
      this.isEdit = false;
    }

  openModal(product: Product) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }

  onlyNumbers(event: KeyboardEvent) {
    const allowed = /[0-9.]|\./;
    if (!allowed.test(event.key)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch =
        !this.searchText ||
        p.productName.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.status.toLowerCase().includes(this.searchText.toLowerCase());

      const matchesStatus =
        this.selectedStatus.length === 0 || this.selectedStatus.includes(p.status);

      return matchesSearch && matchesStatus;
    });
  }

  setStatus(status: OrderStatus) {
    if (this.selectedStatus.includes(status)) {
      this.selectedStatus = this.selectedStatus.filter(s => s !== status);
    } else {
      this.selectedStatus.push(status);
    }
    this.applyFilters();
  }

  resetStatus() {
    this.selectedStatus = [];
    this.applyFilters();
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.currentPage = 1;
    this.applyFilters();
  }

  clearSearch() {
    this.searchText = '';
    this.currentPage = 1;
    this.applyFilters();
  }

  trackById(_index: number, product: Product) {
    return product.id;
  }



  get totalRecords() {
    return this.filteredProducts.length;
  }

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  get startRecordIndex() {
    if (this.totalRecords === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecordIndex() {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  get pagedProducts() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  changePageSize(size: any) {
    this.pageSize = size === 'All' ? this.products.length : +size;
    this.currentPage = 1;
  }

  get isFirstPage() { return this.currentPage <= 1; }
  get isLastPage() { return this.currentPage >= this.totalPages; }

  firstPage() { this.currentPage = 1; }
  lastPage() { this.currentPage = this.totalPages; }
  prevPage() { if (!this.isFirstPage) this.currentPage--; }
  nextPage() { if (!this.isLastPage) this.currentPage++; }

  getStatusBadgeClass(status: OrderStatus): string {
    switch (status) {
      case 'Available': return 'text-bg-success';
      case 'Low Stock': return 'text-bg-warning text-dark';
      case 'Stock Out': return 'text-bg-danger';
      case 'On the Way': return 'text-bg-info text-dark';
      default: return 'text-bg-secondary';
    }
  }
}