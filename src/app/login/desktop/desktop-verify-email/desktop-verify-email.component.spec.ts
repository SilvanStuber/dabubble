import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopVerifyEmailComponent } from './desktop-verify-email.component';

describe('DesktopVerifyEmailComponent', () => {
  let component: DesktopVerifyEmailComponent;
  let fixture: ComponentFixture<DesktopVerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopVerifyEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
