import { inject, Injectable, Input } from '@angular/core';
import { User } from '../../assets/models/user.class';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { Channel } from '../../assets/models/channel.class';
import { DialogEditChannelComponent } from '../main/dialog/dialog-edit-channel/dialog-edit-channel.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogImageMessageComponent } from '../main/dialog/dialog-image-message/dialog-image-message.component';
import { Message } from '../../assets/models/message.class';
import { DialogShowsUserReactionComponent } from '../main/dialog/dialog-shows-user-reaction/dialog-shows-user-reaction.component';
import { DialogSearchChannelsComponent } from '../main/dialog/dialog-search-channels/dialog-search-channels.component';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  @Input() content: string = '';
  @Input() textareaChannelName: string = '';
  @Input() textareaChannelDescription: string = '';
  @Input() placeholder: string = 'Name eingeben';
  addUserClicked = false;
  addetUser: User[] = [];
  filteredUsers: User[] = [];
  usersNotYetAdded: User[] = [];
  isEmpty: boolean = true;
  isChannelNameEmpty: boolean = true;
  isChannelDescriptionEmpty: boolean = true;
  textareaHeight: number = 37;
  filterContentMarginTop: number = 0;
  editUserList: User[] = [];
  public dialog = inject(MatDialog);
  dialogInstance:
    | MatDialogRef<DialogEditChannelComponent, any>
    | MatDialogRef<DialogShowsUserReactionComponent, any>
    | MatDialogRef<DialogSearchChannelsComponent, any>
    | undefined;
  editChannelNameIsOpen: boolean = false;
  editChannelDescriptionIsOpen: boolean = false;
  editChannelAddUserIsOpen: boolean = false;
  textName: string = '';
  textDescription: string = '';
  indexOfThreadMessage: number = 0;
  emojiReactionIndexHoverThread: number | null = null;
  activeMessageIndexReactonThread: number | null = null;
  showEmojiReaction: string = '';
  showUserReactionIndex: number = 0;
  showUserReactionIndexOfEmoji: number = 0;
  showEmojiUserPath: Message[] = [];
  userOfEmoji: string[] = [];
  userIdOfEmoji: string[] = [];
  userAvatarOfEmoji: string[] = [];

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    private router: Router,
  ) { }

  /**
   * Adds each user from the added users list to the current channel and updates the channel's document in the database.
   * After adding users to the channel, it resets and closes the user search interface.
   * This method is typically used when new users are confirmed to be added to a channel.
   */
  pushNewUserToChannel() {
    if (this.addetUser.length !== 0) {
      for (let index = 0; index < this.addetUser.length; index++) {
        const user = this.addetUser[index];
        this.chatService.dataChannel.channelUsers.push(new User(user));
      }
      this.mainService.addDoc(
        'channels',
        this.chatService.dataChannel.id,
        new Channel(this.chatService.dataChannel),
      );
      this.closePeopleSearch();
      this.editChannelAddUserIsOpen = false;
    }
  }

  /**
   * Resets the search state and clears the user addition UI. Sets the textarea height, clears the content,
   * empties the added user list, updates the user edit list, and marks the component as empty and inactive for adding users.
   */
  closePeopleSearch() {
    this.resetArrays();
    this.textareaHeight = 37;
    this.filterContentMarginTop = 0;
    this.content = '';
    this.addetUser = [];
    this.pushUserToEditList();
    this.isEmpty = true;
    this.addUserClicked = false;
  }

  /**
   * Populates the edit user list with users from the main user list, excluding the currently logged-in user.
   * This method is typically used to prepare a list of users that can be edited or managed in the UI.
   */
  pushUserToEditList() {
    this.editUserList.splice(0, this.editUserList.length);
    for (let index = 0; index < this.mainService.allUsers.length; index++) {
      const user = this.mainService.allUsers[index];
      if (user.id !== this.mainService.loggedInUser.id) {
        this.editUserList.push(new User(user));
      }
    }
  }

  /**
   * Filters users based on the provided content, updating the list of filtered users.
   * Users are filtered by checking if the user's name includes the provided content (case insensitive).
   * @param {string} content - The string content used to filter the user names.
   */
  filterUserContent(content: string) {
    this.resetArrays();
    this.filteredUsers = this.editUserList.filter((user) => {
      const userNameLower = user.name.toLowerCase();
      const contentLower = content.toLowerCase();
      const match = userNameLower.includes(contentLower);
      return match;
    });
    this.removeExistingUsers();
  }

  /**
   * Filters and compiles a list of users who are not currently part of the channel. This method considers channel members,
   * the owner, and newly added users to ensure no duplicates are included in the potential addition list.
   * Users not in these groups are added to a list for possible inclusion.
   */
  removeExistingUsers() {
    const channelUserIds = this.chatService.dataChannel.channelUsers.map(
      (user) => user.id,
    );
    const ownerId = this.chatService.dataChannel.ownerUser.map(
      (user) => user.id,
    );
    const addedUserId = this.addetUser.map((user) => user.id);
    this.filteredUsers.forEach((user) => {
      if (
        !channelUserIds.includes(user.id) &&
        !ownerId.includes(user.id) &&
        !addedUserId.includes(user.id)
      ) {
        this.usersNotYetAdded.push(new User(user));
      } else if (ownerId.includes(user.id) && !channelUserIds.includes(user.id)) {
        this.usersNotYetAdded.push(new User(user));
      }
    });
  }

  /**
   * Clears the input content and sets the state to indicate that the input is empty.
   */
  clearInput() {
    this.content = '';
    this.isEmpty = true;
  }

  /**
   * Clears all elements from the `filteredUsers` and `usersNotYetAdded` arrays, effectively resetting them.
   */
  resetArrays() {
    this.filteredUsers.splice(0, this.filteredUsers.length);
    this.usersNotYetAdded.splice(0, this.usersNotYetAdded.length);
  }

  /**
   * Closes the current dialog and updates the state to indicate that adding a user is no longer in progress.
   * This method is used to handle the closing of dialog interfaces within the application.
   */
  closeDialogAddUser() {
    this.chatService.closeDialog();
    this.addUserClicked = false;
  }

  /**
   * Opens a dialog for editing channel details using a DialogEditChannelComponent instance.
   */
  openEditDialog() {
    this.dialogInstance = this.dialog.open(DialogEditChannelComponent);
  }

  /**
   * Closes the currently open dialog instance if one exists and sets the state for editing the channel name to false.
   */
  closeEditChannelDialog() {
    if (this.dialogInstance) {
      this.dialogInstance.close();
    }
    this.editChannelNameIsOpen = false;
  }

  /**
   * Opens the edit channel name interface by setting the corresponding state to true.
   */
  editChannelName() {
    this.editChannelNameIsOpen = true;
  }

  /**
   * Asynchronously saves the updated channel name if it is not empty. The new name is taken from a textarea input,
   * updated in the current dataChannel object, and then saved to the database. It also closes the channel name edit interface.
   */
  async saveChannelName() {
    if (!this.isChannelNameEmpty) {
      this.chatService.dataChannel.name = this.textareaChannelName;
      await this.mainService.addDoc(
        'channels',
        this.chatService.dataChannel.id,
        new Channel(this.chatService.dataChannel),
      );
    }
    this.editChannelNameIsOpen = false;
  }

  /**
   * Opens the edit channel description interface by setting the corresponding state to true.
   */
  editChannelDescription() {
    this.editChannelDescriptionIsOpen = true;
  }

  /**
   * Asynchronously saves the updated channel description if it is not empty. The new description is taken from a textarea input,
   * updated in the current dataChannel object, and then saved to the database. It also closes the channel description edit interface.
   */
  async saveChannelDescription() {
    if (!this.isChannelDescriptionEmpty) {
      this.chatService.dataChannel.description =
        this.textareaChannelDescription;
      await this.mainService.addDoc(
        'channels',
        this.chatService.dataChannel.id,
        new Channel(this.chatService.dataChannel),
      );
    }
    this.editChannelDescriptionIsOpen = false;
  }

  /**
   * Opens the edit channel add user interface by setting the corresponding state to true.
   */
  editChannelAddUserOpen() {
    this.editChannelAddUserIsOpen = true;
  }

  /**
   * Closes the edit channel add user interface by setting the corresponding state to false.
   */
  editChannelAddUserClose() {
    this.editChannelAddUserIsOpen = false;
  }

  /**
   * Asynchronously removes the logged-in user from the current channel's user list, updates the channel document in the database,
   * closes any channel edit dialog, navigates to the main page, and loads a new channel.
   */
  async leaveChannel() {
    const loggedInUserId = this.mainService.loggedInUser.id;
    const channelUsers = this.chatService.dataChannel.channelUsers;
    for (let index = 0; index < channelUsers.length; index++) {
      if (channelUsers[index].id === loggedInUserId) {
        this.chatService.dataChannel.channelUsers.splice(index, 1);
      }
    }
    await this.mainService.addDoc(
      'channels',
      this.chatService.dataChannel.id,
      new Channel(this.chatService.dataChannel),
    );
    this.closeEditChannelDialog();
    this.router.navigate([
      '/main',
      'chat',
      this.mainService.allChannels[0].id,
      'user',
      'chat',
    ]);
    this.loadNewChannel();
  }

  /**
   * Loads the first channel from the list of all channels and subscribes to its updates. Updates are handled by setting the received channel data to the chat service's data channel.
   */
  loadNewChannel() {
    this.mainService
      .watchSingleChannelDoc(this.mainService.allChannels[0].id, 'channels')
      .subscribe((dataChannel) => {
        this.chatService.dataChannel = dataChannel as Channel;
      });
  }

  /**
   * Opens a dialog to show user reactions for a specific message and emoji.
   *
   * Closes any previous reaction dialog, sets the selected emoji and its index,
   * and loads the reaction data for the message at the given index.
   * Then opens a dialog to display the users who reacted to the message.
   */
  async openDialogShowsUserReaction(
    singleMessageIndex: number,
    emojiIndex: number,
    emoji: string,
  ) {
    this.closeDialogShowsUserReaction();
    this.showEmojiReaction = emoji;
    this.showUserReactionIndex = singleMessageIndex;
    this.showUserReactionIndexOfEmoji = emojiIndex;
    this.showEmojiUserPath = this.chatService.dataChannel.messageChannel;
    await this.loadDataFromShowReactionUsers();
    this.dialogInstance = this.dialog.open(DialogShowsUserReactionComponent);
  }

  /**
   * Loads the user data for the selected emoji reaction on a specific message.
   *
   * Clears the current lists of user avatars, names, and IDs. Then, it populates these lists
   * based on the users who reacted with the selected emoji at the given message and emoji index.
   */
  async loadDataFromShowReactionUsers() {
    this.userOfEmoji = [];
    this.userIdOfEmoji = [];
    this.userAvatarOfEmoji = [];
    this.showEmojiUserPath[this.showUserReactionIndex].emojiReaction[
      this.showUserReactionIndexOfEmoji
    ].userAvatar.forEach((avatar) => {
      this.userAvatarOfEmoji.push(avatar);
    });
    this.showEmojiUserPath[this.showUserReactionIndex].emojiReaction[
      this.showUserReactionIndexOfEmoji
    ].userName.forEach((name) => {
      this.userOfEmoji.push(name);
    });
    this.showEmojiUserPath[this.showUserReactionIndex].emojiReaction[
      this.showUserReactionIndexOfEmoji
    ].user.forEach((idUser) => {
      this.userIdOfEmoji.push(idUser);
    });
  }

  /**
   * Closes the dialog showing user reactions, if it is currently open.
   */
  closeDialogShowsUserReaction() {
    if (this.dialogInstance) {
      this.dialogInstance.close();
    }
  }


  /**
  * Manages the state of the chat dialog. If the chat dialog is not open or if the search channels dialog is open, it closes any currently open dialogs and then opens the chat dialog.
  */
  openDialogSearchChannels() {
    if (!this.chatService.dialogMentionUserOpen || this.chatService.dialogEmojiOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogSearchChannelsComponent);
      this.chatService.dialogMentionUserOpen = true;
    } else {
      this.closeDialog();
    }
    setTimeout(() => {
      this.chatService.activateChatFocus();
    }, 400);
  }

  /**
  * Closes the dialog if it is currently open. Logs the attempt and the result of the dialog closure.
  */
  closeDialog(): void {
    if (this.dialogInstance) {
      this.dialogInstance.close();
      this.chatService.dialogEmojiOpen = false;
      this.chatService.dialogAddUserOpen = false;
      this.chatService.dialogMentionUserOpen = false;
    }
  }
}
