import { Component } from '@angular/core';
import { VerifyEmailCardComponent } from "../../shared/verify-email-card/verify-email-card.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { LoginService } from '../../../service/login.service';

@Component({
    selector: 'app-mobile-verify-email',
    standalone: true,
    templateUrl: './mobile-verify-email.component.html',
    styleUrl: './mobile-verify-email.component.scss',
    imports: [VerifyEmailCardComponent, CommonModule, MatIcon]
})
export class MobileVerifyEmailComponent {

  overlayNewMail$: Observable<boolean> | undefined;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.overlayNewMail$ = this.loginService.isNewMail$;
  }

}
