import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopNewPasswordComponent } from './desktop-new-password.component';

describe('DesktopNewPasswordComponent', () => {
  let component: DesktopNewPasswordComponent;
  let fixture: ComponentFixture<DesktopNewPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopNewPasswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
