import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillInfoService } from '../../services/bill-info-service';
import { Bill } from '../../models/bill';
import { BillInfo } from '../../models/bill-info';
import { ToastrService } from 'ngx-toastr';
import { BillService } from '../../services/bill-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-info',
  imports: [CommonModule],
  templateUrl: './bill-info.html',
  styleUrl: './bill-info.css'
})
export class AddBillInfo implements OnInit {

  billInfos: BillInfo[] = [];
  detailBill: any = null;
  selectedBillDetails: any[] = [];
  selectedInvoice: any;

  detailGroup: any = null;

  constructor(private billInfoService: BillInfoService, private router: Router,
    private billService: BillService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadBillInfos()
  }

  loadBillInfos(): void {
    this.billInfoService.getAllBillInfos().subscribe({
      next: (data) => this.billInfos = data,
      error: (err) => console.error('Failed to load bill info', err)
    });
  }

  openDetails(bill: any): void {
    this.selectedInvoice = bill;

    this.billService.getAllBill().subscribe({
      next: (res: Bill[]) => {
        this.selectedBillDetails = res.filter(b => b.invoiceNo === bill.invoiceNo);
      },
      error: () => {
        this.toastr.error('Failed to load details');
      }
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

  goToInvoice(id: number | string): void {
  this.router.navigate(['/invoicePage', id]);
}

  get totalAmount(): number {
    return this.billInfos.reduce((sum, b) => sum + b.amount, 0);
  }

  openDetailModal(b: any): void {
    this.detailGroup = null;

    this.billService.getAllBill().subscribe({
      next: (res: Bill[]) => {
        const items = res.filter((bill: Bill) => bill.invoiceNo === b.invoiceNo);

        setTimeout(() => {
          this.detailGroup = {
            id: b.id,
            invoiceNo: b.invoiceNo,
            customerName: b.clientName,
            companyName: b.companyName,
            date: b.date,
            dueDate: b.dueDate,
            items: items
          };
        });
      },
      error: () => {
        this.toastr.error('Failed to load details');
      }
    });
  }

  closeDetailModal(): void {
    this.detailGroup = null;
  }

  getGroupTotal(items: any[]): number {
    return items.reduce((sum, x) => sum + x.amount, 0);
  }

  get groupTotal(): number {
    if (!this.detailGroup) return 0;
    return this.detailGroup.items.reduce((sum: number, b: Bill) => sum + b.amount, 0);
  }


}