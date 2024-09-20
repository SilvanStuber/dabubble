import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowsUserReactionComponent } from './dialog-shows-user-reaction.component';

describe('DialogShowsUserReactionComponent', () => {
  let component: DialogShowsUserReactionComponent;
  let fixture: ComponentFixture<DialogShowsUserReactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogShowsUserReactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogShowsUserReactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
