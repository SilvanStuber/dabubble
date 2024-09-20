import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileLoginComponent } from '../mobile/mobile-login/mobile-login.component'
import { DesktopLoginComponent } from '../desktop/desktop-login/desktop-login.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MobileLoginComponent,
    DesktopLoginComponent,
    FormsModule,
    LoginComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  isDesktop: boolean = false;

  constructor( private breakpointObserver: BreakpointObserver ) { }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });
  }

}
