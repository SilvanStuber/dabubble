import { HostListener, Injectable, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { DirectMessageService } from './direct-message.service';
import { MainServiceService } from './main-service.service';
import { User } from '../../assets/models/user.class';
import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { Router } from '@angular/router';
import { DialogImageMessageComponent } from '../main/dialog/dialog-image-message/dialog-image-message.component';
import { MatDialogRef } from '@angular/material/dialog';
import { NewMessageComponent } from '../main/new-message/mobile-new-message/new-message.component';

@Injectable({
  providedIn: 'root',
})
export class NewMessageService {
  searchText = '';
  textNewMessage = '';
  userData: User | undefined;
  channelData: Channel = new Channel();
  sendetMessage = false;
  messageChannel: Message = new Message();
  dataChannel: Channel = new Channel();
  newThreadOnFb: Channel = new Channel();
  imageMessage: string | ArrayBuffer | null = '';
  newMessageDialog: any;

  constructor(
    private chatService: ChatService,
    private directMessageService: DirectMessageService,
    private mainService: MainServiceService,
    private router: Router,
  ) { }

  /**
   * Selects a user for direct messaging by setting the search text, user data,
   * and user ID for a new message. Checks if direct messaging is available for the selected user.
   * Logs an error if the check fails.
   *
   * @param {string} name - The name of the selected user.
   * @param {User} user - The user object of the selected user.
   */
  async chooseUser(name: string, user: User) {
    this.searchText = name;
    this.userData = user;
    this.directMessageService.userIdNewMessage = user.id;
    try {
      await this.directMessageIsAvailableNewMessage(this.userData);
    } catch (err) {
      console.log('Ist hier ein Fehler:', err);
    }
  }

  /**
   * Selects a channel by setting the search text and creating a new channel object.
   *
   * @param {string} name - The name of the selected channel.
   * @param {any} channel - The data object for the selected channel.
   */
  chooseChannel(name: string, channel: any) {
    this.searchText = name;
    this.channelData = new Channel(channel);
  }

  /**
   * Sets the reference for the new message dialog.
   *
   * @param {MatDialogRef<NewMessageComponent>} dialogRef - The reference to the dialog component for creating a new message.
   */
  setDialogRef(dialogRef: MatDialogRef<NewMessageComponent>): void {
    this.newMessageDialog = dialogRef;
  }

  /**
   * Sends a message to either a direct message or a channel, depending on the selected context.
   *
   * If user data is present, the message is sent as a direct message after loading chat content.
   * If channel data is present, the message is sent to the selected channel.
   * Closes the new message dialog after sending the message and clears relevant input fields.
   *
   * @param {string} message - The message content to be sent.
   */
  async sendMessage(message: string) {
    if (this.userData) {
      await this.loadDirectChatContent(
        this.directMessageService.directMessageDocId,
      );
      this.directMessageService.imageMessage = this.imageMessage;
      this.directMessageService.sendMessageFromDirectMessage(
        this.directMessageService.dataDirectMessage.id,
        message,
        this.imageMessage,
      );
      if (this.newMessageDialog) {
        this.newMessageDialog.close();
      }
      this.searchText = '';
      this.textNewMessage = '';
      this.imageMessage = '';
    } else if (this.channelData) {
      this.sendMessageFromChannelNewChannelMessage(
        this.channelData.id,
        message,
      );
      if (this.newMessageDialog) {
        this.newMessageDialog.close();
      }
    }
    this.clearData();
  }

  /**
   * Clears the current user data and resets the new message flag in the main service.
   */
  clearData() {
    this.userData = undefined;
    this.mainService.newMessage = false;
  }

  /**
   * Loads the direct chat content for a given chat ID.
   *
   * Sets the direct message document ID and subscribes to the user data and direct message data streams.
   * Updates the clicked user and the channel data accordingly.
   *
   * @param {string} chatId - The ID of the direct message chat to load.
   * @returns {Promise<any>} A promise that resolves with the direct message data.
   */
  async loadDirectChatContent(chatId: string) {
    this.directMessageService.directMessageDocId = chatId;
    this.mainService
      .watchUsersDoc(this.directMessageService.userIdNewMessage, 'users')
      .subscribe((dataUser) => {
        this.chatService.clickedUser = dataUser as User;
      });
    return new Promise((resolve) => {
      this.mainService
        .watchSingleDirectMessageDoc(chatId, 'direct-message')
        .subscribe((dataDirectMessage) => {
          this.chatService.dataChannel = dataDirectMessage as Channel;
          resolve(dataDirectMessage);
        });
    });
  }

  /**
   * Checks if a direct message between the current user and the selected user already exists.
   *
   * Compares the messages of the logged-in user and the selected user to find common messages.
   * If a common message is found, sets the direct message document ID and marks the message as available.
   * If no common message exists, pushes a new direct message document to Firebase.
   *
   * @param {User} userData - The user object of the selected user.
   */
  async directMessageIsAvailableNewMessage(userData: User) {
    this.directMessageService.directMessageIdIsAvailable = false;
    this.directMessageService.directMessageId = '';
    const choosedUserMessages = userData.message;
    const loggedInUserMessages = this.mainService.loggedInUser.message;
    if (
      Array.isArray(choosedUserMessages) &&
      Array.isArray(loggedInUserMessages)
    ) {
      const commonMessages = choosedUserMessages.filter((msg) =>
        loggedInUserMessages.includes(msg),
      );
      if (commonMessages.length !== 0) {
        this.directMessageService.directMessageDocId =
          commonMessages[0].toString();
        this.directMessageService.directMessageIdIsAvailable = true;
      }
    }
    await this.pushDirectMessageDocToFirebase(userData);
  }

  /**
   * Pushes a new direct message document to Firebase if no existing direct message is available.
   *
   * If the direct message is not available, it creates a new direct message with an empty user list
   * and adds it to Firebase. Afterward, it associates the new direct message ID with the selected user.
   *
   * @param {User} userData - The user object of the selected user.
   */
  async pushDirectMessageDocToFirebase(userData: User) {
    if (!this.directMessageService.directMessageIdIsAvailable) {
      this.directMessageService.newDataDirectMessage.channelUsers = [];
      await this.mainService.addNewDocOnFirebase(
        'direct-message',
        new Channel(this.directMessageService.newDataDirectMessage),
      );
      await this.pushDirectMessageIdToUser(userData);
    }
  }

  /**
   * Pushes the newly created direct message ID to both the logged-in user and the selected user.
   *
   * Updates the message list for both users by adding the new direct message ID.
   * Sets the direct message ID and adds both users to the direct message's user list.
   * Finally, pushes the new direct message content to Firebase.
   *
   * @param {User} userData - The user object of the selected user.
   */
  async pushDirectMessageIdToUser(userData: User) {
    this.mainService.loggedInUser.message.push(this.mainService.docId);
    userData.message.push(this.mainService.docId);
    this.directMessageService.directMessageId = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.id = this.mainService.docId;
    this.directMessageService.newDataDirectMessage.channelUsers.push(
      new User(this.mainService.loggedInUser),
    );
    this.directMessageService.newDataDirectMessage.channelUsers.push(
      new User(userData),
    );
    this.pushNewDirectmessageContenToFb(userData);
  }

  /**
   * Pushes the new direct message content to Firebase for both the logged-in user and the selected user.
   *
   * Updates the Firebase documents for both the logged-in user and the selected user.
   * Also updates the direct message document with the new direct message content.
   *
   * @param {User} userData - The user object of the selected user.
   */
  async pushNewDirectmessageContenToFb(userData: User) {
    await this.mainService.addDoc(
      'users',
      this.mainService.loggedInUser.id,
      new User(this.mainService.loggedInUser),
    );
    await this.mainService.addDoc('users', userData.id, new User(userData));
    await this.mainService.addDoc(
      'direct-message',
      this.directMessageService.directMessageDocId,
      new Channel(this.directMessageService.newDataDirectMessage),
    );
  }

  /**
   * Pushes the updated direct message content to Firebase.
   *
   * Updates the logged-in user's and the selected user's documents in Firebase,
   * then updates the direct message document with the new direct message data.
   *
   * @param {User} userData - The user object of the selected user.
   */
  async sendMessageFromChannelNewChannelMessage(
    channelId: string,
    textContent: string,
  ) {
    if (textContent) {
      try {
        await this.generateThreadDoc();
      } catch (err) {
        console.log('Error', err);
      }
      this.messageChannel.message = textContent;
      this.messageChannel.date = Date.now();
      this.messageChannel.userId = this.mainService.loggedInUser.id;
      this.messageChannel.userName = this.mainService.loggedInUser.name;
      this.messageChannel.userEmail = this.mainService.loggedInUser.email;
      this.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
      this.messageChannel.dateOfLastThreadMessage = Date.now();
      this.messageChannel.numberOfMessage = 0;
      this.messageChannel.imageToMessage = this.imageMessage as ArrayBuffer;
      this.channelData.messageChannel.push(this.messageChannel);
      this.sendMessageChannelNewChannelMessage();
    }
  }

  /**
   * Generates a new thread document and pushes it to Firebase.
   *
   * Marks the message as sent, removes the first element of the messageChannel array,
   * and creates a new thread document in Firebase.
   * Updates the thread ID for the message channel and resets the message content afterward.
   */
  async generateThreadDoc() {
    this.sendetMessage = true;
    this.newThreadOnFb.messageChannel.splice(0, 1);
    this.newThreadOnFb.id = '';
    await this.mainService.addNewDocOnFirebase('threads', this.newThreadOnFb);
    this.messageChannel.thread = this.mainService.docId;
    this.newThreadOnFb.id = this.mainService.docId;
    this.resetMessageContent();
  }

  /**
   * Resets the message content fields and clears the sent message flag after a delay.
   *
   * Resets the text and searchText fields to empty strings.
   * After a 2-second delay, it sets the `sendetMessage` flag to false.
   */
  resetMessageContent() {
    this.textNewMessage = '';
    this.searchText = '';
    setTimeout(() => {
      this.sendetMessage = false;
    }, 2000);
  }

  /**
   * Sends a new message to a channel and creates a new thread for the message.
   *
   * Adds the message to the message channel, sets the channel ID and name on the new thread object,
   * then attempts to push both the thread and channel data to Firebase.
   * If successful, it loads the chat from the new message. Logs any errors that occur during the process.
   */
  async sendMessageChannelNewChannelMessage() {
    this.newThreadOnFb.messageChannel.push(this.messageChannel);
    this.newThreadOnFb.idOfChannelOnThred = this.channelData.id;
    this.newThreadOnFb.name = this.channelData.name;
    try {
      await this.mainService.addDoc(
        'threads',
        this.newThreadOnFb.id,
        new Channel(this.newThreadOnFb),
      );
      await this.mainService.addDoc(
        'channels',
        this.channelData.id,
        new Channel(this.channelData),
      );
    } catch (err) {
      console.log('error', err);
    }
    this.loadChatFromNewMessage();
  }

  /**
   * Loads the chat interface after a new message is sent to a channel.
   *
   * Navigates to the chat view for the selected channel and subscribes to updates for the channel data.
   * Updates the chat service state for both mobile and desktop chat views, ensuring the channel chat is open,
   * while direct chat is closed. Resets the message input fields for text and image.
   */
  loadChatFromNewMessage() {
    this.router.navigate([
      '/main',
      'chat',
      this.channelData.id,
      'user',
      'chat',
    ]);
    this.mainService
      .watchSingleChannelDoc(this.channelData.id, 'channels')
      .subscribe((dataChannel) => {
        this.chatService.dataChannel = dataChannel as Channel;
      });
    this.chatService.mobileChatIsOpen = true;
    this.chatService.mobileDirectChatIsOpen = false;
    this.chatService.desktopChatOpen = true;
    this.chatService.directChatOpen = false;
    this.chatService.newMessageOpen = false;
    this.chatService.text = '';
    this.chatService.directText = '';
    this.imageMessage = '';
  }

  /**
   * Clears the content of the image message.
   */
  deleteMessage() {
    this.imageMessage = '';
  }

  /**
   * Handles file selection events and reads the first selected file as a data URL. If the file is successfully read, the resulting data URL is stored in `imageMessage`.
   */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          this.imageMessage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
}
