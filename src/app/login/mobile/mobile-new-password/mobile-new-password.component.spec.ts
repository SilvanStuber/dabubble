import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNewPasswordComponent } from './mobile-new-password.component';

describe('MobileNewPasswordComponent', () => {
  let component: MobileNewPasswordComponent;
  let fixture: ComponentFixture<MobileNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNewPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
