import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileVerifyEmailComponent } from './mobile-verify-email.component';

describe('MobileVerifyEmailComponent', () => {
  let component: MobileVerifyEmailComponent;
  let fixture: ComponentFixture<MobileVerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileVerifyEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
