import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerInvoice } from './customer-invoice';

describe('CustomerInvoice', () => {
  let component: CustomerInvoice;
  let fixture: ComponentFixture<CustomerInvoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerInvoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerInvoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
