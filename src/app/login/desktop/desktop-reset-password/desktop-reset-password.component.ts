import { Component } from '@angular/core';
import { ResetPasswordCardComponent } from "../../shared/reset-password-card/reset-password-card.component";
import { Observable } from 'rxjs';
import { LoginService } from '../../../service/login.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-desktop-reset-password',
    standalone: true,
    templateUrl: './desktop-reset-password.component.html',
    styleUrl: './desktop-reset-password.component.scss',
    imports: [ResetPasswordCardComponent, CommonModule, MatIcon]
})
export class DesktopResetPasswordComponent {

    overlayResetPassword$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.overlayResetPassword$ = this.loginService.sendResetPasswordMail$;
    }

}
