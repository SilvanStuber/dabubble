import { Injectable, inject, OnInit } from '@angular/core';
import { MainServiceService } from '../service/main-service.service';
import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updateEmail,
  verifyBeforeUpdateEmail,
} from '@angular/fire/auth';
import { Firestore, setDoc, doc } from '@angular/fire/firestore';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  currentUser: any;
  isEmailSend: boolean = false;
  isEmailError: boolean = false;

  constructor(
    public mainService: MainServiceService,
    private firestore: Firestore,
    private loginService: LoginService,
  ) {}

  /**
   * Updates the user's profile with the provided name and email.
   *
   * If no name or email is provided, it uses the current user's existing name or email.
   * Updates the user's profile in Firebase. If the email is changed, it updates the authentication email as well.
   *
   * @param {string} name - The new name to update (optional).
   * @param {string} email - The new email to update (optional).
   */
  async updateUserProfile(name: string, email: string) {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });
    if (!name) {
      name = this.currentUser.name;
    }
    if (!email) {
      email = this.currentUser.email;
    }
    await setDoc(
      doc(this.firestore, 'users', this.currentUser.id),
      {
        name: name,
      },
      { merge: true },
    );
    if (email !== this.currentUser.email) {
      this.updateEmailToAuth(email);
    }
  }

  /**
   * Updates the user's email in Firebase Authentication and sends a verification email.
   *
   * Attempts to update the current user's email with the new email provided.
   * If the update is successful, it sets the `isEmailSend` flag to true.
   * If there's an error during the process, it sets the `isEmailError` flag to true.
   *
   * @param {string} newEmail - The new email to update.
   */
  async updateEmailToAuth(newEmail: string) {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      await verifyBeforeUpdateEmail(user, newEmail)
        .then(() => {
          this.isEmailSend = true;
        })
        .catch((error) => {
          this.isEmailError = true;
        });
    }
  }
}
