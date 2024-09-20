import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmojiComponent } from './dialog-emoji.component';

describe('DialogEmojiComponent', () => {
  let component: DialogEmojiComponent;
  let fixture: ComponentFixture<DialogEmojiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEmojiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogEmojiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
