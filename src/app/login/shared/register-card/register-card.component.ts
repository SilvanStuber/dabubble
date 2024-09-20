import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {createUserWithEmailAndPassword, getAuth} from '@angular/fire/auth';
import {doc, Firestore, setDoc} from '@angular/fire/firestore';
import {FormsModule, NgForm} from '@angular/forms';
import {MatIcon, MatIconModule} from '@angular/material/icon';
import {Router, RouterModule} from '@angular/router';
import {User} from '../../../../assets/models/user.class';
import {MainServiceService} from '../../../service/main-service.service';
import {Channel} from '../../../../assets/models/channel.class';

@Component({
  selector: 'app-register-card',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule, FormsModule, MatIcon],
  templateUrl: './register-card.component.html',
  styleUrl: './register-card.component.scss',
})
export class RegisterCardComponent {
  name = '';
  email = '';
  password = '';
  users = new User();
  isEmailAvaiable: string | undefined;
  isUserRegister: string | undefined;
  isPasswordAvaiable: string | undefined;
  isCheckedPolicy: boolean | undefined;

  constructor(
    private router: Router,
    private firestore: Firestore,
    private mainService: MainServiceService
  ) {}

  submitRegister(registerForm: NgForm) {
    if (registerForm.valid) {
      this.saveRegister();
    }
  }

  async saveRegister() {
    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        this.email,
        this.password
      );
      const user = userCredential.user;

      const newUser = new User({
        id: user.uid,
        name: this.name,
        email: this.email,
        avatar: '',
        message: '',
        online: false,
      });

      const userRef = doc(this.firestore, 'users', user.uid);
      await setDoc(userRef, newUser.toJSON());
      this.router.navigate(['/create-avatar']);

      this.mainService.allChannels.forEach(async channel => {
        channel.channelUsers.push(new User(newUser));

        this.mainService.addDoc('channels', channel.id, new Channel(channel));
      });
    } catch (error: any) {
      console.error('Fehler beim Registrieren des Benutzers:', error);
      if (error.code === 'auth/email-already-in-use') {
        this.isEmailAvaiable = 'Diese E-Mail-Adresse ist bereits benutzt.';
      } else if (error.code === 'auth/invalid-email') {
        this.isEmailAvaiable = 'Diese E-Mail-Adresse ist nicht gültig.';
      } else if (error.code === 'auth/missing-email') {
        this.isEmailAvaiable = 'Bitte gib eine E-Mail-Adresse ein.';
      } else if (error.code === 'auth/operation-not-allowed') {
        this.isUserRegister =
          'Operation not allowed. Please enable Email/Password authentication.';
      } else if (error.code === 'auth/weak-password') {
        this.isPasswordAvaiable = 'Dieses Passwort ist zu schwach.';
      } else if (error.code === 'auth/missing-password') {
        this.isPasswordAvaiable = 'Bitte gib ein Passwort ein';
      } else {
        this.isUserRegister = 'User is not register';
      }
    }
  }
}
