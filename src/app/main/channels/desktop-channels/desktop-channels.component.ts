import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MainServiceService } from '../../../service/main-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Router } from '@angular/router';
import { ChatService } from '../../../service/chat.service';
import { NewMessageComponent } from '../../new-message/mobile-new-message/new-message.component';
import { LoginService } from '../../../service/login.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { DirectChatComponent } from '../../chat/direct-chat/direct-chat.component';
import { Subscription, take } from 'rxjs';
import { Channel } from '../../../../assets/models/channel.class';
import { User } from '../../../../assets/models/user.class';
import { ThreadService } from '../../../service/thread.service';
import { NewMessageService } from '../../../service/new-message.service';
import { SearchFieldService } from '../../../service/search-field.service';

@Component({
  selector: 'app-desktop-channels',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    AddChannelComponent,
    NewMessageComponent,
    DirectChatComponent,
  ],
  templateUrl: './desktop-channels.component.html',
  styleUrl: './desktop-channels.component.scss',
})
export class DesktopChannelsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private subscription: Subscription = new Subscription();
  private itemsSubscription?: Subscription;
  channelListOpen: boolean = true;
  userListOpen: boolean = true;
  currentUser: any;
  arrowIconChannels: string = 'arrow_drop_down';
  arrowIconUser: string = 'arrow_drop_down';
  selectedChannel: any;
  activeChannelId: string = '2jA0CJLj9sjowEvllKMg';

  allChannel: Channel[] = [];

  constructor(
    public mainService: MainServiceService,
    private loginService: LoginService,
    private router: Router,
    public chatService: ChatService,
    public directMessageService: DirectMessageService,
    public threadService: ThreadService,
    public searchField: SearchFieldService,
    public newMessageService: NewMessageService,
  ) { }

  /**
   * Initializes the component and sets up necessary subscriptions.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
    });

    this.subscription = this.searchField.allChannel$.subscribe((channels) => {
      this.allChannel = channels;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Opens a specific channel and sets the necessary properties and routes.
   * @param {any} channel - The channel to open.
   */
  openChannel(channel: any) {
    this.threadService.closeThread();
    this.router.navigate(['/main', 'chat', channel.id, 'user', 'chat']);
    this.mainService
      .watchSingleChannelDoc(channel.id, 'channels')
      .pipe(take(1))
      .subscribe((dataChannel) => {
        this.chatService.dataChannel = dataChannel as Channel;
      });
    this.chatService.mobileChatIsOpen = true;
    this.chatService.mobileDirectChatIsOpen = false;
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;
    this.chatService.newMessageOpen = false;
    this.activeChannelId = channel.id;
    this.chatService.text = '';
    this.chatService.directText = '';
    this.chatService.activateChatFocus();
  }

  /**
   * Opens a direct chat with a specific user.
   * @param {User} user - The user to open a direct chat with.
   */
  async openDirectChat(user: User) {
    this.clearData();
    this.chatService.clickedUser.id = user.id;
    this.chatService.clickedUser = user;
    await this.directMessageService.directMessageIsAvailable();
    this.directMessageService.directMessageDocId = this.mainService.docId;
    this.chatService.activateChatFocus();
    this.threadService.closeThread();
    this.chatService.mobileChatIsOpen = false;
    this.chatService.mobileDirectChatIsOpen = false;
    this.chatService.desktopChatOpen = false;
    this.chatService.directChatOpen = true;
    this.chatService.newMessageOpen = false;
    this.activeChannelId = '';
  }

  /**
   * Opens the new message interface.
   */
  openNewMessage() {
    this.clearData();
    this.mainService.changeInputContentNewMessage('');
    this.chatService.desktopChatOpen = false;
    this.chatService.directChatOpen = false;
    this.mainService.newMessage = true;
    this.chatService.newMessageOpen = true;
    this.activeChannelId = '';
  }

  /**
   * Clear Data from Chat, Direct-Chat and Threads.
   */
  clearData() {
    this.chatService.editOpen = false;
    this.mainService.clearContentObservable();
    this.chatService.dataChannel = new Channel();
    this.chatService.dataThread = new Channel();
    this.chatService.dataDirectChat = new Channel();
    this.chatService.text = '';
    this.chatService.directText = '';
    this.newMessageService.textNewMessage = '';
    this.chatService.editText = '';
    this.threadService.textThread = '';
  }

  /**
   * Opens the dialog to add a new channel.
   */
  openDialogAddChannel() {
    this.dialog.open(AddChannelComponent);
  }

  /**
   * Toggles the visibility of the channel list and updates the arrow icon.
   */
  openChannels() {
    this.channelListOpen = !this.channelListOpen;
    this.arrowIconChannels =
      this.arrowIconChannels === 'arrow_right'
        ? 'arrow_drop_down'
        : 'arrow_right';
  }

  /**
   * Toggles the visibility of the user list and updates the arrow icon.
   */
  openUserList() {
    this.userListOpen = !this.userListOpen;
    this.arrowIconUser =
      this.arrowIconUser === 'arrow_right' ? 'arrow_drop_down' : 'arrow_right';
  }

  /**
   * Sets the mobile chat status to open in the chat service.
   */
  setVariableOpenChat() {
    this.chatService.mobileChatIsOpen = true;
  }
}

