import { Component, OnInit } from '@angular/core';
import { MobileResetPasswordComponent } from "../mobile/mobile-reset-password/mobile-reset-password.component";
import { DesktopResetPasswordComponent } from "../desktop/desktop-reset-password/desktop-reset-password.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    imports: [MobileResetPasswordComponent, DesktopResetPasswordComponent, CommonModule]
})
export class ResetPasswordComponent implements OnInit {

  isDesktop: boolean = false;

  constructor( private breakpointObserver: BreakpointObserver ) {}

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });
  }

}
