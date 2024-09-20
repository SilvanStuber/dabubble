import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import { MainServiceService } from '../../../service/main-service.service';
import { Channel } from '../../../../assets/models/channel.class';

@Component({
  selector: 'app-avatar-card',
  standalone: true,
  imports: [
    MatIcon,
    CommonModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './avatar-card.component.html',
  styleUrl: './avatar-card.component.scss'
})
export class AvatarCardComponent {

  avatarImg = [
    './assets/img/user/user1.svg',
    './assets/img/user/user2.svg',
    './assets/img/user/user3.svg',
    './assets/img/user/user4.svg',
    './assets/img/user/user5.svg',
    './assets/img/user/user6.svg',
  ];

  selectedAvatarImage: any = './assets/img/user/user1.svg';

  constructor(private router: Router, private firestore: Firestore, private loginService: LoginService, private mainService: MainServiceService) { }

  /**
   * 
   * The selected avatar image is uploaded to Firebase and the user is redirected to the login page.
   * @param event - Click event
   */
  async saveAndBackToLogin(event: Event) {
    this.eventPreventDefault(event);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      this.loginService.setUserRegistered(true);
      this.setAvatarImageToFirebase(user);
      this.redirectedToLogin();
    }
  }

  /**
   * 
   * The selected avatar image is uploaded to Firebase.
   * @param user - Current user data
   */
  async setAvatarImageToFirebase(user: any) {
    await setDoc(doc(this.firestore, 'users', user.uid), {
      avatar: this.selectedAvatarImage
    }, { merge: true });

    this.mainService.allChannels.forEach(async channel => {

      const filterId = channel.channelUsers.findIndex(userId => user.uid === userId.id);

      if (filterId) {
        channel.channelUsers[filterId].avatar = (this.selectedAvatarImage);
        this.mainService.addDoc('channels', channel.id, new Channel(channel));
      }
    });

  }

  /**
   * 
   * Resets the default behavior of the button.
   * @param event - Click event
   */
  eventPreventDefault(event: Event) {
    if (event) {
      event.preventDefault();
    }
  }

  /**
   * 
   * Redirected to the login page with a 2-second delay.
   */
  redirectedToLogin() {
    setTimeout(() => {
      this.router.navigate(['login']).then(() => {
        this.loginService.setUserRegistered(false);
      });
    }, 2000);
  }

  /**
   * 
   * The selected avatar images from the list are saved.
   * @param index - Current index from array
   */
  chooseAvatar(index: number) {
    this.selectedAvatarImage = this.avatarImg[index];
  }

  /**
   * 
   * Saves the selected image and stores it in a variable.
   * @param event - Event for input type file
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.selectedAvatarImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

}