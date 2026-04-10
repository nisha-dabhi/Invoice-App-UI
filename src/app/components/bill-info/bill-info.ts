import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillInfoService } from '../../services/bill-info-service';
import { Bill } from '../../models/bill';
import { BillInfo } from '../../models/bill-info';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bill-info',
  imports: [CommonModule],
  templateUrl: './bill-info.html',
  styleUrl: './bill-info.css'
})
export class AddBillInfo implements OnInit {

  billInfos: any[] = [];
  detailBill: any = null;

  
  detailGroup: any = null;

  constructor(private billInfoService: BillInfoService , private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadBillInfos();
  }

  loadBillInfos(): void {
    this.billInfoService.getAllBillInfos().subscribe({
      next: (data) => this.billInfos = data,
      error: (err) => console.error('Failed to load bill info', err)
    });
  }

  openModal(bill: any): void {
    this.detailBill = bill;
  }

  closeModal(): void {
    this.detailBill = null;
  }

  delete(id: number): void {
    if (confirm('Are you sure to delete?')) {
      this.billInfoService.deleteBillInfo(id).subscribe({
        next: () => {
          if (this.detailBill?.id === id) this.closeModal();
          this.loadBillInfos();
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  get groupedBillInfos() {
    const groups: { [key: string]: { invoiceNo: string; date: any; dueDate: any; 
                     companyName: string; clientName: string; items: any[] } } = {};

    this.billInfos.forEach(b => {
      const key = b.invoiceNo;
      if (!groups[key]) {
        groups[key] = {
          invoiceNo: b.invoiceNo,
          date: b.date,
          dueDate: b.dueDate,
          companyName: b.companyName,
          clientName: b.clientName,
          items: []
        };
      }
      groups[key].items.push(b);
    });

    return Object.values(groups);
  }

  get totalAmount(): number {
    return this.billInfos.reduce((sum, b) => sum + b.amount, 0);
  }
  
  openDetailModal(group: any): void {
  this.detailGroup = {
    invoiceNo:    group.invoiceNo,
    customerName: group.customerName,
    companyName:  group.companyName,
    date:         group.date,
    dueDate:      group.dueDate,
    items:        [...group.items]  
  };
  console.log('detailGroup:', this.detailGroup); 
}

  closeDetailModal(): void {
    this.detailGroup = null;
  }

  get groupTotal(): number {
    if (!this.detailGroup) return 0;
    return this.detailGroup.items.reduce((sum: number, b: Bill) => sum + b.amount, 0);
  }

   saveInvoiceToBillInfo(group: any): void {
    const totalAmount = group.items.reduce((sum: number, b: Bill) => sum + b.amount, 0);

    const billInfo: BillInfo = {
      id: 0,
      invoiceNo: group.invoiceNo,
      date: group.date,
      dueDate: group.dueDate,
      companyName: group.companyName,
      clientName: group.customerName,
      amount: +totalAmount.toFixed(2)
    };

    this.billInfoService.addBillInfo(billInfo).subscribe({
      next: () => {
        this.toastr.success('Invoice saved to Bill Info!', 'Success');
      },
      error: (err) => {
        this.toastr.error('BillInfo save failed!', 'Error');
      }
    });
  }

}