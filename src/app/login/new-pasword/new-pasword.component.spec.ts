import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaswordComponent } from './new-pasword.component';

describe('NewPaswordComponent', () => {
  let component: NewPaswordComponent;
  let fixture: ComponentFixture<NewPaswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPaswordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPaswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
