import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MainServiceService } from '../../../service/main-service.service';
import { UserProfileService } from '../../../service/user-profile.service';
import { ChatService } from '../../../service/chat.service';
import { DirectMessageService } from '../../../service/direct-message.service';

@Component({
  selector: 'app-dialog-user-chat',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './dialog-user-chat.component.html',
  styleUrl: './dialog-user-chat.component.scss',
})
export class DialogUserChatComponent {
  currentUser = this.mainService.loggedInUser;
  editProfileOpen: boolean = false;
  updateUserName: string = '';
  updateUserEmail: string = '';
  userStatus: string = './assets/img/offline.svg';

  constructor(
    public dialogRef: MatDialogRef<UserProfileComponent>,
    public mainService: MainServiceService,
    public chatService: ChatService,
    public userProfileService: UserProfileService,
    public directMessageService: DirectMessageService,
  ) {}

  /**
   * Initializes component by fetching the current logged user, checking user status, and setting dialog close status.
   */
  ngOnInit() {
    this.mainService.currentLoggedUser();
    this.checkUserStatus();
  }

  /**
   * Updates the user status icon based on the current user's online status.
   */
  checkUserStatus() {
    if (this.currentUser.online) {
      this.userStatus = './assets/img/aktive.svg';
    } else {
      this.userStatus = './assets/img/offline.svg';
    }
  }

  /**
   * Closes the current dialog.
   */
  closeDialog() {
    this.dialogRef.close();
  }
  /**
   * Toggles the visibility state of the user profile editing interface.
   */
  editUserProfile() {
    this.editProfileOpen = !this.editProfileOpen;
  }

  /**
   * Asynchronously updates the current user's profile with new name and email, then refreshes the user data and closes the edit profile interface.
   */
  async updateCurrentUser() {
    let name = this.updateUserName;
    let email = this.updateUserEmail;
    await this.userProfileService.updateUserProfile(name, email);
    this.currentUser = this.mainService.loggedInUser;
    this.editProfileOpen = false;
  }
}
