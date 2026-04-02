import { Component } from '@angular/core';
import { InvoiceItem } from '../../../models/InvoiceItem';
import { InvoiceItemService } from '../../../services/invoice-item-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-item',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-item.html',
  styleUrl: './add-item.css',
})
export class AddItem {
  item: InvoiceItem = {} as InvoiceItem;
  items: InvoiceItem[] = [];
  isEdit = false;
  companies: { id: number; companyName: string }[] = [];
  companyName: string = '';

  constructor(private companyService: CompanyService  ,private service: InvoiceItemService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadItems();
    this.loadCompanies();
  }

  loadItems() {
    this.service.getAllItem().subscribe(res => {
      this.items = res;
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

  addItem() {
    this.item.amount =
      (this.item.rate * this.item.quantity)
      - this.item.discount
      + this.item.tax;

    if (this.isEdit) {
      this.service.updateItem(this.item.id, this.item).subscribe(() => {
        alert('Updated Successfully');
        this.toastr.success('Item updated successfully!', 'Updated');
        this.resetForm();
        this.loadItems();
      });
    } else {
      this.service.addItem(this.item).subscribe(() => {
        alert('Saved Successfully');
        this.toastr.success('Item added successfully!', 'Success');
        this.resetForm();
        this.loadItems();
      });
    }
  }

  updateItem(data: InvoiceItem) {
    this.item = { ...data };
    this.isEdit = true;
  }

  detailItem(id: number) {
    this.router.navigate(['/item/details', id]);
  }

  deleteItem(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteItem(id).subscribe(() => {
        alert('Deleted Successfully');
        this.toastr.error('Item deleted!', 'Deleted');
        this.loadItems();
      });
    }
  }
  closeCard() {
    this.resetForm();
  }

  resetForm() {
    this.item = {} as InvoiceItem;
    this.isEdit = false;
  }
  openForm() {
      this.item = {} as InvoiceItem;
      this.isEdit = false;      
    }
  
     startRecordIndex: number = 0; 

  onCompIdChange() {
    const comp = this.companies.find(c => c.id === this.item.compId);
    this.companyName = comp ? comp.companyName : '';
  }
}


