import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopRegisterComponent } from './desktop-register.component';

describe('DesktopRegisterComponent', () => {
  let component: DesktopRegisterComponent;
  let fixture: ComponentFixture<DesktopRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
