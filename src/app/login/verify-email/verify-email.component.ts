import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MobileVerifyEmailComponent } from "../mobile/mobile-verify-email/mobile-verify-email.component";
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../service/login.service';
import { applyActionCode, checkActionCode, getAuth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { DesktopVerifyEmailComponent } from '../desktop/desktop-verify-email/desktop-verify-email.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    DesktopVerifyEmailComponent,
    MobileVerifyEmailComponent
  ]
})
export class VerifyEmailComponent implements OnInit {

  isDesktop: boolean = false;
  oobCode: any;

  constructor(private route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private firestore: Firestore) {
    this.route.queryParams.subscribe(params => {
      this.oobCode = params['oobCode'];
    });
  }

  async ngOnInit(): Promise<void> {

    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });

    const auth = getAuth();

    if (this.oobCode) {
      await checkActionCode(auth, this.oobCode)
      await applyActionCode(auth, this.oobCode)
    }
  }

}
