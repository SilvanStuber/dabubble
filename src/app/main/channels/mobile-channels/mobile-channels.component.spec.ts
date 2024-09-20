import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileChannelsComponent } from './mobile-channels.component';

describe('MobileChannelsComponent', () => {
  let component: MobileChannelsComponent;
  let fixture: ComponentFixture<MobileChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileChannelsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
