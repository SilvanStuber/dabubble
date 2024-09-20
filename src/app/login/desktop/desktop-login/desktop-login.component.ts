import { Component, inject, OnInit } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { RouterModule } from '@angular/router';
import {
  animate,
  query,
  sequence,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [LoginCardComponent, RouterModule, CommonModule],
  animations: [
    trigger('desktopStartAnimation', [
      transition('hidden => visible', [
        sequence([
          query(
            'h1',
            [
              style({
                opacity: 0,
                visibility: 'hidden',
                transform: 'translateX(-100%)',
              }),
              animate(
                '500ms ease-in',
                style({
                  opacity: 1,
                  visibility: 'visible',
                  transform: 'translateX(0)',
                })
              ),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
    trigger('desktopSectionAnimation', [
      transition('hidden => visible', [
        style({ opacity: 0 }),
        animate(
          '1s cubic-bezier(0.64, -0.84, 0.28, 1.3)',
          style({ opacity: 1 })
        ),
      ]),
    ]),
    trigger('movingLogo', [
      transition('center => final', [
        style({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          opacity: 0,
        }),
        animate(
          '1s ease-out',
          style({
            top: '75px',
            left: '75px',
            transform: 'translate(0, 0)',
            opacity: 1,
          })
        ),
      ]),
    ]),
  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss',
})
export class DesktopLoginComponent implements OnInit {
  isVisible = 'hidden';
  isSectionVisible = 'hidden';
  showSection: boolean = false;
  hideAnimationContainer: boolean = true;
  isLogoMoving = 'center';

  document = inject(DOCUMENT);

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = 'visible';
      const headlineAnimation = this.document.getElementById('headline');
      headlineAnimation?.classList.remove('hidden');
      headlineAnimation?.classList.add('visible');
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
        if (this.showSection) {
          this.isLogoMoving = 'final';
        }
      }, 1000);
    }
  }
}
