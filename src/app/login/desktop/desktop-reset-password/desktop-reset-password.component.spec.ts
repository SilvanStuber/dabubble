import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopResetPasswordComponent } from './desktop-reset-password.component';

describe('DesktopResetPasswordComponent', () => {
  let component: DesktopResetPasswordComponent;
  let fixture: ComponentFixture<DesktopResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopResetPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
