import { Component } from '@angular/core';
import { DesktopResetPasswordComponent } from "../../desktop/desktop-reset-password/desktop-reset-password.component";
import { ResetPasswordCardComponent } from "../../shared/reset-password-card/reset-password-card.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-mobile-reset-password',
    standalone: true,
    templateUrl: './mobile-reset-password.component.html',
    styleUrl: './mobile-reset-password.component.scss',
    imports: [DesktopResetPasswordComponent, ResetPasswordCardComponent, CommonModule, MatIcon]
})
export class MobileResetPasswordComponent {

    overlayResetPassword$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.overlayResetPassword$ = this.loginService.sendResetPasswordMail$;
    }

}
