import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceItem } from './add-invoice-item';

describe('AddInvoiceItem', () => {
  let component: AddInvoiceItem;
  let fixture: ComponentFixture<AddInvoiceItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvoiceItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvoiceItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
