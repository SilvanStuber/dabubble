import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopChannelsComponent } from './desktop-channels.component';

describe('DesktopChannelsComponent', () => {
  let component: DesktopChannelsComponent;
  let fixture: ComponentFixture<DesktopChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesktopChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesktopChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
