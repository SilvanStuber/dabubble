import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImageMessageComponent } from './dialog-image-message.component';

describe('DialogImageMessageComponent', () => {
  let component: DialogImageMessageComponent;
  let fixture: ComponentFixture<DialogImageMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogImageMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogImageMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
