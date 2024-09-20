import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesktopChatComponent } from './desktop-chat.component';

describe('DesktopChatComponent', () => {
  let component: DesktopChatComponent;
  let fixture: ComponentFixture<DesktopChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopChatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DesktopChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
