import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, AnimationEvent, query, sequence, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-mobile-login',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    LoginCardComponent,
    CommonModule
  ],
  animations: [
    trigger('mobileStartAnimation', [
      transition('hidden => visible', [
        sequence([
          query('h1', [
            style({ opacity: 0, visibility: 'hidden', transform: 'translateX(-100%)' }),
            animate('500ms ease-in', style({ opacity: 1, visibility: 'visible', transform: 'translateX(0)' }))
          ], { optional: true })
        ])
      ]),
      transition('visible => hidden', [
        style({ opacity: 1 }),
        animate('1.5s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ opacity: 0 }))
      ]),
    ]),
    trigger('mobileSectionAnimation', [
      transition('hidden => visible', [
        style({ opacity: 0 }),
        animate('2s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ opacity: 1 }))
      ])
    ]),
    trigger('movingLogo', [
      transition('center => final', [
        style({ transform: 'translate(-10%, 500%)', zIndex: 10, opacity: 0 }),
        animate('1s ease-out', style({ transform: 'translate(0, 0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './mobile-login.component.html',
  styleUrl: './mobile-login.component.scss'
})
export class MobileLoginComponent {

  isVisible = 'hidden';
  isSectionVisible = 'hidden';
  showSection: boolean = false;
  hideAnimationContainer: boolean = true;
  isLogoMoving = 'center';

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = 'visible';
      const headlineAnimation = document.getElementById('headlineMobile');
      headlineAnimation?.classList.remove('hidden');
      headlineAnimation?.classList.add('visible')
    }, 1000);
  }

  toggleToHidden(event: any): void {
    if (this.isVisible === 'visible') {
      setTimeout(() => {
        this.isVisible = 'hidden';
        this.hideAnimationContainer = false;
      }, 1000);
      setTimeout(() => {
        this.isSectionVisible = 'visible';
        this.showSection = true;
      }, 1000); 
      setTimeout(() => {
        if(this.showSection) {
          this.isLogoMoving = 'final'; 
        }
      }, 1000);
    }
  }

  constructor(private router: Router) { }

  routeToRegister() {
    this.router.navigate(['/register']);
  }

  email: string = '';
  password: string = '';

}
