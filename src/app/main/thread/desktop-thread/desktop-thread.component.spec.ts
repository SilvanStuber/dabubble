import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopThreadComponent } from './desktop-thread.component';

describe('DesktopThreadComponent', () => {
  let component: DesktopThreadComponent;
  let fixture: ComponentFixture<DesktopThreadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopThreadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
