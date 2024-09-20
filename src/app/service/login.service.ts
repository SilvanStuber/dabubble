import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getAuth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userRegisteredSubject = new BehaviorSubject<boolean>(false);
  isUserRegistered$ = this.userRegisteredSubject.asObservable();

  private sendResetPasswordMailSubject = new BehaviorSubject<boolean>(false);
  sendResetPasswordMail$ = this.sendResetPasswordMailSubject.asObservable();

  private newPasswordSubject = new BehaviorSubject<boolean>(false);
  isNewPassword$ = this.newPasswordSubject.asObservable();

  private newMailSubject = new BehaviorSubject<boolean>(false);
  isNewMail$ = this.newMailSubject.asObservable();

  private loggedInUserSubject = new BehaviorSubject<User | null>(null);
  loggedInUser$: Observable<User | null> =
    this.loggedInUserSubject.asObservable();

  constructor(
    private firestore: Firestore,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.checkLocalStorage();
  }

  setUserRegistered(isRegistered: boolean) {
    this.userRegisteredSubject.next(isRegistered);
  }

  setResetPasswordOverlay(isSendMail: boolean) {
    this.sendResetPasswordMailSubject.next(isSendMail);
  }

  setNewPasswordOverlay(isLogin: boolean) {
    this.newPasswordSubject.next(isLogin);
  }

  setNewEmailOverlay(isVerifyMail: boolean) {
    this.newMailSubject.next(isVerifyMail);
  }

  private checkLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user) {
        this.loggedInUserSubject.next(JSON.parse(user));
      }
    }
  }

  currentLoggedUser() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      const userId = user?.uid;
      if (userId) {
        onSnapshot(doc(this.firestore, 'users', userId), (item) => {
          if (item.exists()) {
            const userData = {
              ...item.data(),
              id: item.id,
            };
            this.loggedInUserSubject.next(new User(userData));
          }
        });
      }
    });
  }

  logoutUser(auth: any) {
    const user = auth.currentUser;

    if (user) {
      setDoc(
        doc(this.firestore, 'users', user.uid),
        {
          online: false,
        },
        { merge: true },
      );

      signOut(auth)
        .then(() => {
          const localStorageUser =
            this.document.defaultView?.localStorage.getItem('user');

          if (localStorageUser !== null) {
            localStorage.removeItem('user');
          } else {
            console.warn("Kein 'user' Eintrag im localStorage vorhanden");
          }

          this.loggedInUserSubject.next(null); // Update the subject

          this.router.navigate(['login']);
        })
        .catch((error) => {
          console.log('fehler beim abmelden:', error);
        });
    }
  }

  handleActionCode(actionCode: string, oobCode: string) {
    if (actionCode === 'resetPassword') {
      this.router.navigate(['/new-password'], { queryParams: { oobCode } });
    } else if (actionCode === 'verifyAndChangeEmail') {
      this.router.navigate(['/verify-email'], { queryParams: { oobCode } });
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
