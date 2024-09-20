import { Component } from '@angular/core';
import { LoginCardComponent } from "../../shared/login-card/login-card.component";
import { RegisterCardComponent } from "../../shared/register-card/register-card.component";

@Component({
    selector: 'app-mobile-register',
    standalone: true,
    templateUrl: './mobile-register.component.html',
    styleUrl: './mobile-register.component.scss',
    imports: [LoginCardComponent, RegisterCardComponent]
})
export class MobileRegisterComponent {

}
