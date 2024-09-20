import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopAvatarComponent } from './desktop-avatar.component';

describe('DesktopAvatarComponent', () => {
  let component: DesktopAvatarComponent;
  let fixture: ComponentFixture<DesktopAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopAvatarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
