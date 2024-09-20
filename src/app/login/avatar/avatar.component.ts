import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MobileAvatarComponent } from '../mobile/mobile-avatar/mobile-avatar.component';
import { DesktopAvatarComponent } from '../desktop/desktop-avatar/desktop-avatar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  imports: [MobileAvatarComponent, DesktopAvatarComponent, CommonModule],
})
export class AvatarComponent implements OnInit {
  isDesktop: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isDesktop = !result.matches;
      });
  }
}
