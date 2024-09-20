import { Component } from '@angular/core';
import { applyActionCode, checkActionCode, getAuth, updateEmail } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '../../../service/user-profile.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { LoginService } from '../../../service/login.service';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-verify-email-card',
  standalone: true,
  imports: [
    FormsModule,
    MatIcon
  ],
  templateUrl: './verify-email-card.component.html',
  styleUrl: './verify-email-card.component.scss'
})
export class VerifyEmailCardComponent {
  oobCode: string | undefined;
  newEmail: string = '';

  constructor(private loginService: LoginService, private router: Router, private firestore: Firestore) { }

  async verifyEmail(event: any) {

    this.eventPreventDefault(event);

    const auth = getAuth();
    const user = auth.currentUser;


    try {

      if (this.newEmail) {

        this.loginService.setResetPasswordOverlay(true);

        if (user) {

          await setDoc(doc(this.firestore, 'users', user.uid), {
            email: this.newEmail
          }, { merge: true });

          await updateEmail(user, this.newEmail);

          setTimeout(() => {
            this.loginService.setResetPasswordOverlay(false);
          }, 2000);

          this.router.navigate(['login']);
        }

      }

    } catch (error: any) {

      if(user) {

        await setDoc(doc(this.firestore, 'users', user.uid), {
          email: this.newEmail
        }, { merge: true });
  
        if (error.code === 'auth/user-token-expired') {
          this.router.navigate(['login']);
        }

      }

    }
  }


  eventPreventDefault(event: Event) {
    if (event) {
      event.preventDefault();
    }
  }

}
