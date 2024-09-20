import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAvatarComponent } from './mobile-avatar.component';

describe('MobileAvatarComponent', () => {
  let component: MobileAvatarComponent;
  let fixture: ComponentFixture<MobileAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MobileAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
