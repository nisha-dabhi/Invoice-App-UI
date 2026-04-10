import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillInfo } from './bill-info';

describe('BillInfo', () => {
  let component: BillInfo;
  let fixture: ComponentFixture<BillInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
