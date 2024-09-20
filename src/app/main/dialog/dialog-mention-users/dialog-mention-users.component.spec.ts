import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMentionUsersComponent } from './dialog-mention-users.component';

describe('DialogMentionUsersComponent', () => {
  let component: DialogMentionUsersComponent;
  let fixture: ComponentFixture<DialogMentionUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogMentionUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogMentionUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
