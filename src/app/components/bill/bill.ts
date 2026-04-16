import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Bill } from '../../models/bill';
import { BillInfo } from '../../models/bill-info';
import { BillService } from '../../services/bill-service';
import { CustomerService } from '../../services/customer-service';
import { ProductService } from '../../services/product-service';
import { ToastrService } from 'ngx-toastr';
import { BillInfoService } from '../../services/bill-info-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bill',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './bill.html',
  styleUrl: './bill.css'
})
export class AddBill implements OnInit {

  billForm!: FormGroup;

  tempBills: Bill[] = [];
  bills: Bill[] = [];

  customers: any[] = [];
  products: any[] = [];


  selectedCompanyName: string = '';
  selectedCustomerName: string = '';
  selectedProductPrice: number = 0;
  editId: number = 0;

  isEdit = false;
  editIndex: number = -1;
  showForm = true;

  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private fb: FormBuilder,
    private billService: BillService,
    private billInfoService: BillInfoService,
    private customerService: CustomerService,
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadBills();
    this.loadCustomers();
    this.loadProducts();
  }

  initForm(): void {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 7);

    this.billForm = this.fb.group({
      custoId: ['', Validators.required],
      customerName: [''],
      compId: [''],
      companyName: [''],
      prodId: ['', Validators.required],
      productName: [''],
      price: [''],
      invoiceNo: ['', Validators.required],
      date: [today.toISOString().split('T')[0], Validators.required],
      dueDate: [due.toISOString().split('T')[0], Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      disc: [0],
      tax: [0],
      amount: ['']
    });
  }

  get f() { return this.billForm.controls; }

  loadBills(): void {
    this.billService.getAllBill().subscribe({
      next: (res) => {
        this.bills = res;
        this.generateInvoiceNo();
      },
      error: (err) => console.error('Failed to load bills', err)
    });
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => this.customers = data,
      error: (err) => console.error('Failed to load customers', err)
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Failed to load products', err)
    });
  }

  onCustomerChange(): void {
    const selectedId = this.billForm.get('custoId')?.value;
    const customer = this.customers.find(c => c.id == selectedId);
    if (customer) {
      this.selectedCustomerName = customer.customerName;
      this.selectedCompanyName = customer.companyName;
      this.billForm.patchValue({
        customerName: customer.customerName,
        compId: customer.compId,
        companyName: customer.companyName
      });
    } else {
      this.selectedCustomerName = '';
      this.selectedCompanyName = '';
      this.billForm.patchValue({
        customerName: '',
        compId: '',
        companyName: ''
      });
    }
  }

  onProductChange(): void {
    const selectedId = this.billForm.get('prodId')?.value;
    const product = this.products.find(p => p.id == selectedId);
    if (product) {
      this.selectedProductPrice = product.price;
      this.billForm.patchValue({
        productName: product.productName,
        price: product.price
      });
    } else {
      this.selectedProductPrice = 0;
      this.billForm.patchValue({ productName: '', price: 0 });
    }
    this.calculateAmount();
  }

  calculateAmount(): void {
    const price = +this.billForm.get('price')?.value || 0;
    const quantity = +this.billForm.get('quantity')?.value || 0;
    const disc = +this.billForm.get('disc')?.value || 0;
    const tax = +this.billForm.get('tax')?.value || 0;

    const subtotal = price * quantity;
    const discAmt = (subtotal * disc) / 100;
    const taxAmt = ((subtotal - discAmt) * tax) / 100;
    const total = subtotal - discAmt + taxAmt;

    this.billForm.patchValue({ amount: +total.toFixed(2) });
  }

  addToTemp(): void {
    if (this.billForm.invalid) {
      this.billForm.markAllAsTouched();
      return;
    }

    const row: Bill = { ...this.billForm.value, id: 0 };

    if (this.isEdit && this.editIndex >= 0) {
      this.tempBills[this.editIndex] = row;
      this.isEdit = false;
      this.editIndex = -1;
      alert('UpdatedRow updated Successfully');
      this.toastr.info('Row updated in list', 'Updated');
    } else {
      this.tempBills.push(row);
      alert('Row added Successfully');
      this.toastr.info('Row added to list', 'Added');
    }

    const keepCustoId = this.billForm.get('custoId')?.value;
    const keepCustomerName = this.billForm.get('customerName')?.value;
    const keepCompId = this.billForm.get('compId')?.value;
    const keepCompanyName = this.billForm.get('companyName')?.value;
    const keepDate = this.billForm.get('date')?.value;
    const keepDueDate = this.billForm.get('dueDate')?.value;
    const keepInvoiceNo = this.billForm.get('invoiceNo')?.value;

    this.billForm.patchValue({
      prodId: '',
      productName: '',
      price: '',
      quantity: '',
      disc: 0,
      tax: 0,
      amount: ''
    });

    this.billForm.patchValue({
      custoId: keepCustoId,
      customerName: keepCustomerName,
      compId: keepCompId,
      companyName: keepCompanyName,
      date: keepDate,
      dueDate: keepDueDate,
      invoiceNo: keepInvoiceNo
    });

    this.selectedProductPrice = 0;
  }

  updateBillInDB(b: Bill): void {
    this.billService.updateBill(b.id, b).subscribe({
      next: () => {
        alert('Bill Updated Successfully');
        this.toastr.success('Bill updated!', 'Updated');
        this.loadBills();
      },
      error: (err) => {
        alert('Error!');
        this.toastr.error('Update failed!', 'Error');
      }
    });
  }

  editTempRow(index: number): void {
    this.isEdit = true;
    this.editIndex = index;
    this.showForm = true;
    const row = this.tempBills[index];

    this.selectedCustomerName = row.customerName;
    this.selectedCompanyName = row.companyName;
    this.selectedProductPrice = row.price;

    this.billForm.patchValue(row);
  }

  removeTempRow(index: number): void {
    this.tempBills.splice(index, 1);
    this.toastr.warning('Row removed', 'Removed');
  }

  deleteBill(id: number): void {
    if (confirm('Are you sure to delete?')) {
      this.billService.deleteBill(id).subscribe(() => {
        alert('Deleted Successfully');
        this.toastr.error('Bill deleted!', 'Deleted');
        this.loadBills();
      });
    }
  }

  openForm(): void {
    this.showForm = true;
    this.isEdit = false;
    this.generateInvoiceNo();
  }

  closeCard(): void {
    this.showForm = false;
  }



  resetForm(): void {
    this.billForm.reset({ disc: 0, tax: 0 });
    this.isEdit = false;
    this.editIndex = -1;
    this.selectedCompanyName = '';
    this.selectedCustomerName = '';
    this.selectedProductPrice = 0;
    this.generateInvoiceNo();
  }

  saveBills(index?: number): void {

    if (index !== undefined) {
      const bill = this.tempBills[index];
      this.billService.addBill(bill).subscribe(res => {
        const billInfo: BillInfo = {
          id: 0,
          invoiceNo: res.invoiceNo,
          date: res.date,
          dueDate: res.dueDate,
          companyName: res.companyName,
          clientName: res.customerName,
          amount: res.amount
        };

        this.billInfoService.addBillInfo(billInfo).subscribe(() => {
          alert('Saved Successfully');
          this.toastr.success('Bill saved successfully!');
          this.tempBills.splice(index, 1);
          this.loadBills();
        });

      });
    } else {
      this.tempBills.forEach((bill, i) => {
        this.billService.addBill(bill).subscribe(res => {
          const billInfo: BillInfo = {
            id: 0,
            invoiceNo: res.invoiceNo,
            date: res.date,
            dueDate: res.dueDate,
            companyName: res.companyName,
            clientName: res.customerName,
            amount: res.amount
          };

          this.billInfoService.addBillInfo(billInfo).subscribe(() => {
            if (i === this.tempBills.length - 1) {
              alert('All Saved Successfully');
              this.toastr.success('All Bills Saved!');
              this.tempBills = [];
              this.loadBills();
            }
          });
        });
      });
    }
  }

  generateInvoiceNo(): void {
    this.billService.getAllBill().subscribe({
      next: (allBills) => {

        const allInvoiceNos = [
          ...allBills.map(b => b.invoiceNo),
          ...this.tempBills.map(b => b.invoiceNo)
        ];

        const numbers = allInvoiceNos
          .filter(n => n && n.startsWith('INV'))
          .map(n => parseInt(n.replace('INV', ''), 10))
          .filter(n => !isNaN(n));

        const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
        const next = String(maxNo + 1).padStart(3, '0');
        const invoiceNo = `INV${next}`;
        this.billForm.get('invoiceNo')?.setValue(invoiceNo);
      },
      error: () => {
        this.billForm.get('invoiceNo')?.setValue('INV001');
      }
    });
  }

}


// get groupedBills() {
//   const groups: { [key: string]: { invoiceNo: string; customerName: string; companyName: string; date: any; dueDate: any; items: Bill[] } } = {};

//   this.bills.forEach(b => {
//     const key = b.invoiceNo;
//     if (!groups[key]) {
//       groups[key] = {
//         invoiceNo: b.invoiceNo,
//         customerName: b.customerName,
//         companyName: b.companyName,
//         date: b.date,
//         dueDate: b.dueDate,
//         items: []
//       };
//     }
//     groups[key].items.push(b);
//   });

//   return Object.values(groups);
// }


// editBill(b: Bill): void {
//   this.isEdit = true;
//   this.showForm = true;
//   this.editIndex = -1;
//   this.editId = b.id;

//   const customer = this.customers.find(c => c.id == b.custoId);
//   const product = this.products.find(p => p.id == b.prodId);

//   this.selectedCustomerName = b.customerName;
//   this.selectedCompanyName = b.companyName;
//   this.selectedProductPrice = b.price;

//   this.billForm.patchValue({
//     custoId: b.custoId,
//     customerName: b.customerName,
//     compId: b.compId,
//     companyName: b.companyName,
//     prodId: b.prodId,
//     productName: b.productName,
//     price: b.price,
//     invoiceNo: b.invoiceNo,
//     date: b.date,
//     dueDate: b.dueDate,
//     quantity: b.quantity,
//     disc: b.disc ?? 0,
//     tax: b.tax ?? 0,
//     amount: b.amount
//   });
// }

// selectedInvoiceGroup: any = null;
// showDetailModal: boolean = false;

// openDetailModal(group: any): void {
//   this.selectedInvoiceGroup = group;
//   this.showDetailModal = true;
// }

// closeDetailModal(): void {
//   this.selectedInvoiceGroup = null;
//   this.showDetailModal = false;
// }

// saveInvoiceToBillInfo(group: any): void {

//   const requests = group.items.map((b: any) => {

//     const billInfo: BillInfo = {
//       id: 0,
//       invoiceNo: b.invoiceNo,
//       date: b.date,
//       dueDate: b.dueDate,
//       companyName: b.companyName,
//       clientName: b.customerName,
//       amount: b.amount
//     };

//     return this.billInfoService.addBillInfo(billInfo);
//   });

//   forkJoin(requests).subscribe({
//     next: () => {
//       this.toastr.success('Invoice saved successfully!', 'Success');
//     },
//     error: () => {
//       this.toastr.error('Failed to save invoice', 'Error');
//     }
//   });

// }
// }




