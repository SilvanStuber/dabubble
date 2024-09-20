import { Component, OnInit } from '@angular/core';
import { NewPasswordCardComponent } from "../../shared/new-password-card/new-password-card.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-desktop-new-password',
    standalone: true,
    templateUrl: './desktop-new-password.component.html',
    styleUrl: './desktop-new-password.component.scss',
    imports: [NewPasswordCardComponent, CommonModule]
})
export class DesktopNewPasswordComponent implements OnInit {

    isNewPassword$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) {}

    ngOnInit(): void {
        this.isNewPassword$ = this.loginService.isNewPassword$;
    }

}
