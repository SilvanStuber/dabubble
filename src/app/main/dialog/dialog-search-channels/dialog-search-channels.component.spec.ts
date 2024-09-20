import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSearchChannelsComponent } from './dialog-search-channels.component';

describe('DialogSearchChannelsComponent', () => {
  let component: DialogSearchChannelsComponent;
  let fixture: ComponentFixture<DialogSearchChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSearchChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogSearchChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
