import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRegisterComponent } from './mobile-register.component';

describe('MobileRegisterComponent', () => {
  let component: MobileRegisterComponent;
  let fixture: ComponentFixture<MobileRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
