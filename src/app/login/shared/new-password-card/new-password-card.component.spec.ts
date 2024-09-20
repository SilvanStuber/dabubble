import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordCardComponent } from './new-password-card.component';

describe('NewPasswordCardComponent', () => {
  let component: NewPasswordCardComponent;
  let fixture: ComponentFixture<NewPasswordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPasswordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
