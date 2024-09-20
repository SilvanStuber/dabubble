import { Component } from '@angular/core';
import { NewPasswordCardComponent } from "../../shared/new-password-card/new-password-card.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-mobile-new-password',
    standalone: true,
    templateUrl: './mobile-new-password.component.html',
    styleUrl: './mobile-new-password.component.scss',
    imports: [NewPasswordCardComponent, CommonModule]
})
export class MobileNewPasswordComponent {

    isNewPassword$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) {}

    ngOnInit(): void {
        this.isNewPassword$ = this.loginService.isNewPassword$;
    }

}
