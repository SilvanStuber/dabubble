import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { User } from '../../../../assets/models/user.class';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { LoginService } from '../../../service/login.service';
import { MainServiceService } from '../../../service/main-service.service';

@Component({
  selector: 'app-login-card',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent implements OnInit {

  constructor(private firestore: Firestore, private router: Router, private loginService: LoginService, private mainService: MainServiceService) { }

  ngOnInit() {
    const auth = getAuth();
    this.loginService.logoutUser(auth);
    this.mainService.subChannelsList();
  }
  email: string = '';
  password: string = '';
  wrongPassword: string | undefined;
  wrongEmail: string | undefined;


  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Standardverhalten verhindern (Formularübermittlung)
      this.login(); // Ihre Anmeldelogik aufrufen
    }
  }


  async login() {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {

        const user = auth.currentUser;

        if (user) {
          setDoc(doc(this.firestore, 'users', user.uid), {
            online: true
          }, { merge: true });

          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
          this.router.navigate(['/main','chat', this.mainService.allChannels[0].id, 'user', 'chat']);
        }
      })
      .catch((error: any) => {
        if (error.code === 'auth/invalid-credential') {
          this.wrongEmail = 'Diese E-Mail-Adresse ist leider ungültig';
          this.wrongPassword = 'Falsches Passwort. Bitte noch einmal prüfen';
        } else if (error.code === 'auth/missing-password') {
          this.wrongPassword = 'Bitte gib ein Passwort ein.';
        } else if (error.code === 'auth/invalid-email') {
          this.wrongEmail = 'Bitte gib eine gültige E-Mail-Adresse an';
        }
      })

  }

  async loginAnonymus() {
    const auth = getAuth();

    this.email = 'gaeste-login@dabubble.com';
    this.password = 'Gaeste2024';

    await signInWithEmailAndPassword(auth, this.email, this.password)
      .then(() => {

        const user = auth.currentUser;

        if (user) {
          setDoc(doc(this.firestore, 'users', user.uid), {
            online: true
          }, { merge: true });

          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
        }));
          this.router.navigate(['/main','chat', this.mainService.allChannels[0].id, 'user', 'chat']);
        }
      })
  }

  async loginWithGoogle() {

    try {

      const auth = getAuth();
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {

          const token = credential.accessToken;

          const user = result.user;
          if (user) {
            const userRef = doc(this.firestore, 'users', user.uid);
            await setDoc(userRef, {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              avatar: user.photoURL,
              online: true
            }, { merge: true });

            localStorage.setItem('user', JSON.stringify({
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
          }));

          }
          this.router.navigate(['/main','chat', this.mainService.allChannels[0].id, 'user', 'chat']);
        }
      })


    }
    catch (error) {
      console.error("Fehler bei der Anmeldung mit Google:", error);
    } 

  } 

}
