import { Component } from '@angular/core';
import { MobileNewPasswordComponent } from "./../mobile/mobile-new-password/mobile-new-password.component";
import { DesktopNewPasswordComponent } from "./../desktop/desktop-new-password/desktop-new-password.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-new-pasword',
    standalone: true,
    templateUrl: './new-pasword.component.html',
    styleUrl: './new-pasword.component.scss',
    imports: [MobileNewPasswordComponent, DesktopNewPasswordComponent, CommonModule]
})
export class NewPaswordComponent {
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
