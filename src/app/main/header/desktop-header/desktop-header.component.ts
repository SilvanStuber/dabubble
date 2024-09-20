import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { FormsModule } from '@angular/forms';
import { DirectMessageService } from '../../../service/direct-message.service';
import { ChatService } from '../../../service/chat.service';
import { Channel } from '../../../../assets/models/channel.class';
import { ThreadService } from '../../../service/thread.service';
import { Subscription, take } from 'rxjs';
import { SearchFieldService } from '../../../service/search-field.service';

@Component({
  selector: 'app-desktop-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, UserProfileComponent, FormsModule],
  templateUrl: './desktop-header.component.html',
  styleUrl: './desktop-header.component.scss',
})
export class DesktopHeaderComponent implements OnInit {
  currentUser: any;
  private dialog = inject(MatDialog);
  userMenu: boolean = false;
  private subscription: Subscription = new Subscription();
  searchValue: string = '';
  allChannel: Channel[] = [];

  constructor(
    public mainService: MainServiceService,
    private loginService: LoginService,
    private router: Router,
    private directMessageService: DirectMessageService,
    private chatService: ChatService,
    public searchField: SearchFieldService,
    public threadService: ThreadService,
  ) { }

  /**
   * Initializes the component.
   * Retrieves the current logged user and subscribes to changes in the logged in user.
   * Updates the currentUser property and sets the loggedInUser property in the main service.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });

    this.subscription = this.searchField.allChannel$.subscribe((channels) => {
      this.allChannel = channels;
    });
  }

  /**
   *
   * Opens a direct chat for the user that is clicked on.
   * @param user - User that is clicked on.
   */
  async openDirectChat(user: any) {
    this.chatService.desktopChatOpen = false;
    this.chatService.directChatOpen = true;
    this.chatService.clickedUser = user;
    await this.directMessageService.directMessageIsAvailable();
    this.searchValue = '';
  }

  /**
   *
   * Opens a channel is clicked on.
   * @param channel - Channel that is clicked on
   */
  openChannel(channel: any) {
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;
    this.router.navigate(['/main', 'chat', channel.id, 'user', 'chat']);
    this.mainService
      .watchSingleChannelDoc(channel.id, 'channels')
      .pipe(take(1))
      .subscribe((dataChannel) => {
        this.chatService.dataChannel = dataChannel as Channel;
      });
    this.searchValue = '';
  }

  /**
   * Prevents the event from propagating further.
   *
   * @param event - The event object.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Toggles the user menu.
   */
  openUserMenu() {
    this.userMenu = !this.userMenu;
  }

  /**
   * Opens the user profile dialog.
   */
  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }

  /**
   * Logs out the user.
   */
  logout() {
    this.threadService.closeThread();
    const auth = getAuth();
    this.loginService.logoutUser(auth);
  }
}
