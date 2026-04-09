import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InVoice } from './in-voice';

describe('InVoice', () => {
  let component: InVoice;
  let fixture: ComponentFixture<InVoice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InVoice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InVoice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
