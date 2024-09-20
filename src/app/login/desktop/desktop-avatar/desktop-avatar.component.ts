import { Component, OnInit } from '@angular/core';
import { AvatarCardComponent } from "../../shared/avatar-card/avatar-card.component";
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-desktop-avatar',
    standalone: true,
    templateUrl: './desktop-avatar.component.html',
    styleUrl: './desktop-avatar.component.scss',
    imports: [AvatarCardComponent, CommonModule]
})
export class DesktopAvatarComponent implements OnInit {

    overlayRegistered$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.overlayRegistered$ = this.loginService.isUserRegistered$;
    }

}
