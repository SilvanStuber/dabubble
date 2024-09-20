import { Component } from '@angular/core';
import { AvatarCardComponent } from "../../shared/avatar-card/avatar-card.component";
import { LoginService } from '../../../service/login.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mobile-avatar',
    standalone: true,
    templateUrl: './mobile-avatar.component.html',
    styleUrl: './mobile-avatar.component.scss',
    imports: [AvatarCardComponent, CommonModule ]
})
export class MobileAvatarComponent {

    overlayRegistered$: Observable<boolean> | undefined;

    constructor(private loginService: LoginService) { }

    ngOnInit(): void {
        this.overlayRegistered$ = this.loginService.isUserRegistered$;
    }

}
