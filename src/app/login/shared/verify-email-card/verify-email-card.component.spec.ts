import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailCardComponent } from './verify-email-card.component';

describe('VerifyEmailCardComponent', () => {
  let component: VerifyEmailCardComponent;
  let fixture: ComponentFixture<VerifyEmailCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyEmailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
