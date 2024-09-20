import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopNewMessageComponent } from './desktop-new-message.component';

describe('DesktopNewMessageComponent', () => {
  let component: DesktopNewMessageComponent;
  let fixture: ComponentFixture<DesktopNewMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopNewMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopNewMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
