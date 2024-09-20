import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';
import { VerifyEmailCardComponent } from '../../shared/verify-email-card/verify-email-card.component';

@Component({
  selector: 'app-desktop-verify-email',
  standalone: true,
  templateUrl: './desktop-verify-email.component.html',
  styleUrl: './desktop-verify-email.component.scss',
  imports: [VerifyEmailCardComponent, MatIcon, CommonModule]
})
export class DesktopVerifyEmailComponent {

  overlayNewMail$: Observable<boolean> | undefined;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.overlayNewMail$ = this.loginService.isNewMail$;
  }

}
