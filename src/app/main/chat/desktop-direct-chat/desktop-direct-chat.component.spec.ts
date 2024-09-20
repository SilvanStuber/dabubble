import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopDirectChatComponent } from './desktop-direct-chat.component';

describe('DesktopDirectChatComponent', () => {
  let component: DesktopDirectChatComponent;
  let fixture: ComponentFixture<DesktopDirectChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopDirectChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopDirectChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
