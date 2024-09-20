import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { DesktopRegisterComponent } from "../desktop/desktop-register/desktop-register.component";
import { MobileRegisterComponent } from "../mobile/mobile-register/mobile-register.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    imports: [DesktopRegisterComponent, MobileRegisterComponent, CommonModule]
})
export class RegisterComponent implements OnInit {
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
