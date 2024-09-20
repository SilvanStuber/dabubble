import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserChatComponent } from './dialog-user-chat.component';

describe('DialogUserChatComponent', () => {
  let component: DialogUserChatComponent;
  let fixture: ComponentFixture<DialogUserChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUserChatComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogUserChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
