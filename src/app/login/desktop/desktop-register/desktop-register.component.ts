import { Component } from '@angular/core';
import { RegisterCardComponent } from "../../shared/register-card/register-card.component";

@Component({
    selector: 'app-desktop-register',
    standalone: true,
    templateUrl: './desktop-register.component.html',
    styleUrl: './desktop-register.component.scss',
    imports: [RegisterCardComponent]
})
export class DesktopRegisterComponent {

}
