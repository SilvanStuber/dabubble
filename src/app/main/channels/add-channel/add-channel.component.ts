import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MainServiceService } from '../../../service/main-service.service';
import { Channel } from '../../../../assets/models/channel.class';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChatService } from '../../../service/chat.service';
import { User } from '../../../../assets/models/user.class';
import { ChannelService } from '../../../service/channel.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss',
})
export class AddChannelComponent implements OnInit {
  addUserMenu: boolean = false;
  isAddUserMenuOpen: boolean = false;
  addUserInput: boolean = false;
  newChannelName: string = '';
  newChannelDescription: string = '';
  dataChannel: Channel = new Channel();
  isDesktop: boolean = false;
  isThreadOpen: boolean = false;
  createdChannel: any;
  activeChannelId: string | null = null;
  selectetUser: boolean = false;
  checkName: boolean = false;
  searchChannelName: any;

  @Output() contentChange = new EventEmitter<string>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private chatService: ChatService,
    public dialogRef: MatDialogRef<AddChannelComponent>,
    public mainService: MainServiceService,
    public ChatService: ChatService,
    public channelService: ChannelService,
    private cdr: ChangeDetectorRef,
    public directMessageService: DirectMessageService,
    private router: Router,
  ) {
    this.channelService.pushUserToEditList();
  }

  /**
   * Initialisiert den Component und setzt die notwendigen Beobachtungen und Werte.
   */
  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe((result) => {
        this.isDesktop = !result.matches;
      });

    this.mainService.currentLoggedUser();
    this.updateIsEmpty();
    if (this.channelService.isEmpty) {
      this.channelService.content = this.channelService.placeholder;
    }
  }

  checkChannelNames() {
    const lowerCaseNewChannelName = this.newChannelName.toLowerCase();
    this.searchChannelName = this.mainService.allChannels.find(
      (channelName) =>
        channelName.name.toLowerCase() === lowerCaseNewChannelName,
    );

    if (this.newChannelName !== '' && !this.searchChannelName) {
      this.checkName = true;
    } else {
      this.checkName = false;
    }
  }

  /**
   * Closes the dialog and resets the added user list.
   * Also, sets a timeout to close the add user menu after 2 seconds.
   */
  closeDialog() {
    this.channelService.addetUser = [];
    this.dialogRef.close();
    setTimeout(() => {
      this.isAddUserMenuOpen = false;
    }, 2000);
  }

  /**
   * Prevents the event from propagating, which stops the dialog from closing.
   * @param {Event} event - The event object.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Toggles the add user menu. If the device is a desktop, it sets the add user menu to open.
   * @param {Event} event - The event object.
   */
  openAddUserMenu(event: Event) {
    event.stopPropagation();
    this.addUserMenu = !this.addUserMenu;
    this.isAddUserMenuOpen = true;
  }

  /**
   * Toggles the visibility of the add user input field and sets the selected user flag to true.
   */
  addUserInputfield() {
    this.addUserInput = !this.addUserInput;
    this.selectetUser = true;
  }

  addUserInputfieldOff() {
    this.addUserInput = false;
    this.selectetUser = false;
  }

  /**
   * Creates a new channel by setting the necessary properties and then adds it to Firestore under the 'channels' collection.
   * This function sets the channel's name and description based on class properties before creating a new Channel instance
   * and adding it to Firebase.
   */
  async addChannel() {
    this.dataChannel.name = this.newChannelName;
    this.dataChannel.description = this.newChannelDescription;
    this.dataChannel.openingDate = Date.now();
    this.pushUserToNewChannel();
    this.dataChannel.ownerUser.push(new User(this.mainService.loggedInUser));
    await this.mainService.addNewDocOnFirebase('channels', this.dataChannel);
    this.chatService.mobileChatIsOpen = true;
    this.createdChannel = this.mainService.allChannels;
    this.openChannel(this.createdChannel[1]);
    this.closeDialog();
    if (this.mainService.newMessage && this.chatService.newMessageOpen) {
      this.mainService.newMessage = false;
      this.chatService.newMessageOpen = false;
    }
  }

  /**
   * Adds users to the new channel based on the user's selection.
   */
  pushUserToNewChannel() {
    if (!this.selectetUser) {
      this.dataChannel.channelUsers = this.mainService.allUsers;
    } else {
      this.dataChannel.channelUsers = this.channelService.addetUser;
    }
  }

  /**
   * Opens a specific channel and sets the necessary properties and routes.
   * @param {Channel} channel - The channel to open.
   */
  openChannel(channel: Channel) {
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;
    this.activeChannelId = channel.id;
    this.router.navigate([
      '/main',
      'chat',
      this.mainService.docId,
      'user',
      'chat',
    ]);
    this.mainService
      .watchSingleChannelDoc(this.mainService.docId, 'channels')
      .pipe(take(1))
      .subscribe((dataChannel) => {
        this.chatService.dataChannel = dataChannel as Channel;
      });
    this.chatService.dataChannel = channel;
  }

  /**
   * Activates the user search interface and triggers change detection.
   * This method is called when the user initiates a search for adding a new user.
   */
  openSearchUser() {
    this.channelService.addUserClicked = true;
    this.cdr.detectChanges();
  }

  /**
   * Updates the content based on user input, filters user-related content, and emits an event if the content is not empty.
   * @param {Event} [event] - Optional event parameter that can be used to pass event data.
   */
  updateContent(event?: Event): void {
    this.updateIsEmpty(this.channelService.content);
    this.channelService.filterUserContent(this.channelService.content);
    if (!this.channelService.isEmpty) {
      this.contentChange.emit(this.channelService.content);
    }
  }

  /**
   * Updates the `isEmpty` state of the content based on its presence or if it matches the placeholder.
   * @param {string} [content] - Optional content string to check against the placeholder for emptiness.
   */
  updateIsEmpty(content?: string) {
    this.channelService.isEmpty =
      !content || content === this.channelService.placeholder;
  }

  /**
   * Clears the content if it is empty when the component gains focus.
   * This method responds to the `focusin` event to manage content initialization.
   */
  @HostListener('focusin')
  onFocusIn() {
    if (this.channelService.isEmpty) {
      this.channelService.content = '';
    }
  }

  /**
   * Sets the content to a placeholder if it is empty or emits the current content if not, when the component loses focus.
   * This method responds to the `focusout` event to ensure the content is appropriately managed when focus is lost.
   */
  @HostListener('focusout')
  onFocusOut() {
    if (this.channelService.isEmpty) {
      this.channelService.content = this.channelService.placeholder;
    } else {
      this.contentChange.emit(this.channelService.content);
    }
  }

  /**
   * Adds a selected user to the added users list, removes them from the edit list, and clears the content.
   * It also updates the component state and UI, such as checking if the content is empty and adjusting the contenteditable element's height.
   * @param {User} userFilter - The user object to add to the added users list.
   * @param {number} indexFilterUser - The index of the user in the edit user list to remove.
   * @param {Event} event - The event object, typically from a user interaction.
   */
  pushAddetUser(userFilter: User, indexFilterUser: number, event: Event) {
    this.channelService.editUserList.splice(indexFilterUser, 1);
    this.channelService.addetUser.push(userFilter);
    this.channelService.content = '';
    this.updateContent(event);
    this.updateIsEmpty(this.channelService.content);
    this.channelService.filterUserContent(this.channelService.content);
    if (!this.channelService.isEmpty) {
      this.contentChange.emit(this.channelService.content);
    }
    const editableDiv = document.querySelector('[contenteditable="true"]');
    if (editableDiv) editableDiv.innerHTML = '';
  }

  /**
   * Increases the height of the textarea by a set increment and triggers change detection to update the view.
   * This method is typically used to adjust the layout dynamically based on content or interaction changes.
   */
  calculateHeight() {
    this.channelService.textareaHeight =
      this.channelService.textareaHeight + 37;
    this.channelService.filterContentMarginTop =
      this.channelService.filterContentMarginTop + 37;
    this.cdr.detectChanges();
  }

  /**
   * Removes a user from the added users list, adds them back to the editable user list, and adjusts the textarea height.
   * This method manages user lists dynamically and updates the UI correspondingly when a user is removed.
   * @param {User} deletUser - The user to be removed from the added users list and added back to the editable list.
   * @param {number} indexAddUser - The index of the user in the added users list to be removed.
   */
  removeAddUser(deletUser: User, indexAddUser: number) {
    this.channelService.editUserList.push(deletUser);
    this.channelService.addetUser.splice(indexAddUser, 1);
    this.channelService.textareaHeight =
      this.channelService.textareaHeight - 37;
    this.cdr.detectChanges();
  }
}

