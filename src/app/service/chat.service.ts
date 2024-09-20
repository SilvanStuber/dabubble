import { HostListener, Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../main/dialog/dialog-emoji/dialog-emoji.component';
import { DialogMentionUsersComponent } from '../main/dialog/dialog-mention-users/dialog-mention-users.component';
import { Channel } from '../../assets/models/channel.class';
import { Message } from '../../assets/models/message.class';
import { MainServiceService } from './main-service.service';
import { MentionUser } from '../../assets/models/mention-user.class';
import { DialogUserChatComponent } from '../main/dialog/dialog-user-chat/dialog-user-chat.component';
import { User } from '../../assets/models/user.class';
import { Router } from '@angular/router';
import { DialogAddUserComponent } from '../main/dialog/dialog-add-user/dialog-add-user.component';
import { DialogEditChannelComponent } from '../main/dialog/dialog-edit-channel/dialog-edit-channel.component';
import { firstValueFrom, Subject } from 'rxjs';
import { DialogImageMessageComponent } from '../main/dialog/dialog-image-message/dialog-image-message.component';
@Injectable({ providedIn: 'root' })
export class ChatService {
  contentEmojie: any;
  public dialog = inject(MatDialog);
  dialogInstance:
    | MatDialogRef<DialogEmojiComponent, any>
    | MatDialogRef<DialogMentionUsersComponent, any>
    | MatDialogRef<DialogUserChatComponent, any>
    | MatDialogRef<DialogAddUserComponent, any>
    | MatDialogRef<DialogEditChannelComponent, any>
    | MatDialogRef<DialogImageMessageComponent, any>
    | undefined;
  dialogEmojiOpen: boolean = false;
  dialogMentionUserOpen: boolean = false;
  dialogAddUserOpen: boolean = false;
  dialogImageMessageOpen: boolean = false;
  mentionUser: MentionUser = new MentionUser();
  dataChannel: Channel = new Channel();
  dataDirectChat: Channel = new Channel();
  dataThread: Channel = new Channel();
  newThreadOnFb: Channel = new Channel();
  contentMessageOfThread: Message = new Message();
  messageChannel: Message = new Message();
  messageThread: Message = new Message();
  allMessangeFromThread: Message[] = [];
  idOfChannel: string = '';
  indexOfChannelMessage = 0;
  clickedUser: User = new User();
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;
  editMessageIndex: number | null = null;
  editMessageInputIndex: number | null = null;
  editOpen: boolean = false;
  text = '';
  directText: string = '';
  editText = '';
  editTextMobile = '';
  loggedInUser: User = new User();
  mobileChatIsOpen: boolean = false;
  mobileDirectChatIsOpen: boolean = false;
  mobileThreadIsOpen: boolean = false;
  mobileNewMessageOpen: boolean = false;
  directChatOpen: boolean = false;
  desktopChatOpen: boolean = true;
  newMessageOpen: boolean = false;
  isThreadOpen: boolean = false;
  isWorkspaceOpen: boolean = true;
  closeMenu: string = 'arrow_drop_up';
  closeMenuText: string = 'Workspace-Menü schließen';
  imageMessage: string | ArrayBuffer | null = '';
  indexOfThreadMessageForEditChatMessage = 0;
  ownerThreadMessage = false;
  sendetMessage: boolean = false;
  indexOfThreadMessage = 0;
  emojiReactionIndexHoverThread: number | null = null;
  activeMessageIndexReactonThread: number | null = null;
  fromDirectChat: boolean = false;
  body = document.body;
  private channelChangedSource = new Subject<void>();
  private threadChangedSource = new Subject<void>();
  channelChanged$ = this.channelChangedSource.asObservable();
  threadChanged$ = this.threadChangedSource.asObservable();
  editMessageButtonVisible: boolean = false;
  constructor(
    public mainService: MainServiceService,
    private router: Router,
  ) {}

  /**
   * Triggers a notification to indicate that the chat focus has changed.
   */
  activateChatFocus() {
    this.channelChangedSource.next();
  }

  /**
   * Triggers a notification to indicate that the chat focus has changed.
   */
  activateThreadFocus() {
    this.threadChangedSource.next();
  }

  /**
   * Adjusts the height of a textarea to fit its content without scrolling.
   */
  adjustHeight(eventTarget: EventTarget | null): void {
    if (eventTarget instanceof HTMLTextAreaElement) {
      const textarea = eventTarget;
      textarea.style.overflow = 'hidden';
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  /**
   * Manages the state of the emoji dialog. If the emoji dialog is not open or if the chat dialog is open, it attempts to close any currently open dialogs and opens the emoji dialog.
   */
  openDialogEmoji() {
    this.mainService.emojiReactionMessage = false;
    if (!this.dialogEmojiOpen || this.dialogMentionUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogEmojiComponent);
      this.dialogEmojiOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Manages the state of the chat dialog. If the chat dialog is not open or if the emoji dialog is open, it closes any currently open dialogs and then opens the chat dialog.
   */
  openDialogMentionUser() {
    if (!this.dialogMentionUserOpen || this.dialogEmojiOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogMentionUsersComponent);
      this.dialogMentionUserOpen = true;
    } else {
      this.closeDialog();
    }
    setTimeout(() => {
      this.activateChatFocus();
    }, 400);
  }

  /**
   * Toggles the user addition dialog. Opens the dialog if it's not already open and closes it if it is.
   */
  openDialogAddUser() {
    if (!this.dialogAddUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogAddUserComponent);
      this.dialogAddUserOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Opens a dialog with an image message.
   */
  openImageMessageDialog(image: ArrayBuffer) {
    const dialogRef = this.dialog.open(DialogImageMessageComponent, {
      data: { image: image },
    });
  }

  /**
   * Handles the emoji button click event. Prevents the event from propagating to parent elements.
   */
  onButtonClick(event: MouseEvent): void {
    event.stopPropagation(); // Stoppt die Übertragung des Events zum Elternelement
  }

  /**
   * Closes the dialog if it is currently open. Logs the attempt and the result of the dialog closure.
   */
  closeDialog(): void {
    if (this.dialogInstance) {
      this.dialogInstance.close();
      this.dialogEmojiOpen = false;
      this.dialogAddUserOpen = false;
      this.dialogMentionUserOpen = false;
    }
  }

  /**
   * Prevents an event from bubbling up the event chain. Typically used to stop a parent handler from being notified of an event.
   */
  doNotClose(event: Event) {
    event.stopPropagation();
  }

  /**
   * Asynchronously sends a message from a specific channel, updating the channel data and triggering
   */
  async sendMessageFromChannel(channelId: string, textContent: string) {
    if (textContent || this.imageMessage) {
      await this.generateThreadDoc();
      this.messageChannel.message = textContent;
      this.messageChannel.date = Date.now();
      this.messageChannel.userId = this.mainService.loggedInUser.id;
      this.messageChannel.userName = this.mainService.loggedInUser.name;
      this.messageChannel.userEmail = this.mainService.loggedInUser.email;
      this.messageChannel.userAvatar = this.mainService.loggedInUser.avatar;
      this.messageChannel.imageToMessage = this.imageMessage as ArrayBuffer;
      this.messageChannel.dateOfLastThreadMessage = Date.now();
      this.messageChannel.numberOfMessage = 0;
      this.dataChannel.messageChannel.push(this.messageChannel);
      this.sendMessage();
    }
  }

  /**
   * Resets message content by clearing text and image message properties.
   */
  resetMessageContent() {
    this.text = '';
    setTimeout(() => {
      this.imageMessage = '';
    }, 2000);
    setTimeout(() => {
      this.sendetMessage = false;
    }, 2000);
  }

  /**
   * Asynchronously generates a new document for a thread in Firebase. It sets the newly created document's ID in the main service and updates it in the Firestore database.
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
   * Initiates the process to add a new document for a message within a specified channel.
   */
  async sendMessage() {
    this.newThreadOnFb.messageChannel.push(this.messageChannel);
    this.newThreadOnFb.idOfChannelOnThred = this.dataChannel.id;
    this.newThreadOnFb.name = this.dataChannel.name;
    await this.mainService.addDoc(
      'threads',
      this.newThreadOnFb.id,
      new Channel(this.newThreadOnFb),
    );
    await this.mainService.addDoc(
      'channels',
      this.dataChannel.id,
      new Channel(this.dataChannel),
    );
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

  /**
   * Converts a timestamp from the server into a localized date string. If the date is today, it returns "Heute".
   */
  setDate(timeFromServer: number): string {
    const date = new Date(timeFromServer);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    const localeDate = date.toLocaleDateString('de-DE', options);
    const today = new Date();
    const todayLocaleDate = today.toLocaleDateString('de-DE', options);
    if (localeDate === todayLocaleDate) {
      return 'Heute';
    } else {
      return localeDate;
    }
  }

  /**
   * Converts a timestamp from the server into a localized time string in 24-hour format.
   */
  setTime(timeFromServer: number): string {
    const date = new Date(timeFromServer);
    const formattedTime = date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formattedTime;
  }

  /**
   * Checks if the message is sent by the logged-in user.
   */
  ifMessageFromMe(userIdFromMessage: string): boolean {
    return userIdFromMessage === this.mainService.loggedInUser.id;
  }

  /**
   * Manages the state of the emoji dialog. If the emoji dialog is not open or if the chat dialog is open, it attempts to close any currently open dialogs and opens the emoji dialog. If the emoji dialog is already open, it simply closes it.
   */
  openDialogEmojiReactionMessage(index: number) {
    this.mainService.emojiReactionMessage = true;
    if (!this.mainService.contentToThread) {
      this.indexOfChannelMessage = index;
    } else {
      this.indexOfThreadMessage = index;
    }
    if (!this.dialogEmojiOpen || this.dialogMentionUserOpen) {
      this.closeDialog();
      this.dialogInstance = this.dialog.open(DialogEmojiComponent);
      this.dialogEmojiOpen = true;
    } else {
      this.closeDialog();
    }
  }

  /**
   * Toggles the icon container based on the given index and event. Stops the event propagation if `editOpen` is false.
   */
  toggleIconContainer(index: number, event: MouseEvent): void {
    if (!this.editOpen) {
      event.stopPropagation();
      this.activeMessageIndex = index;
    }
  }

  /**
   * Closes the icon container by setting the active message index to null.
   */
  closeIconContainer() {
    this.activeMessageIndex = null;
  }

  /**
   * Toggles the editing state of a message container based on the provided index and event. Stops event propagation always.
   */
  toggleEditMessageContainer(
    index: number,
    event: MouseEvent,
    messageContent: string,
  ): void {
    event.stopPropagation();
    if (this.editMessageIndex === index) {
      this.editMessageIndex = null;
      this.editMessageInputIndex = null;
      this.editMessageButtonVisible = true;
    } else {
      this.activeMessageIndex = null;
      this.editOpen = true;
      this.editText = messageContent;
      this.editTextMobile = messageContent;
      this.editMessageIndex = index;
      this.editMessageInputIndex = index;
      this.editMessageButtonVisible = false;
    }
  }

  /**
   * Closes the message editor without saving changes. It resets the editing state indices and closes the editor immediately.
   */
  closeWithoutSaving() {
    this.editMessageIndex = null;
    this.editMessageInputIndex = null;
    this.editOpen = false;
    setTimeout(() => {
      this.activeMessageIndex = null;
    }, 125);
  }

  /**
   * Asynchronously edits a message within a channel by updating its text and then sends an update notification. It finalizes by closing the editor without saving further changes.
   */
  async editMessageFromChannel(
    parmsId: string,
    newText: string,
    singleMessageIndex: number,
  ) {
    this.loadContenThreadForEditMessage(singleMessageIndex).then(() => {
      this.dataChannel.messageChannel[singleMessageIndex].message = newText;
      if (!this.fromDirectChat) {
        this.dataThread.messageChannel[0].message = newText;
        this.mainService.addDoc(
          'channels',
          this.dataChannel.id,
          new Channel(this.dataChannel),
        );
        this.mainService.addDoc(
          'threads',
          this.dataThread.id,
          new Channel(this.dataThread),
        );
      } else {
        this.mainService.addDoc(
          'direct-message',
          this.dataChannel.id,
          new Channel(this.dataChannel),
        );
      }
      this.closeWithoutSaving();
      this.fromDirectChat = false;
    });
  }

  /**
   * Asynchronously loads a content thread for editing a message based on its index.
   */
  async loadContenThreadForEditMessage(
    singleMessageIndex: number,
  ): Promise<void> {
    if (!this.fromDirectChat) {
      const dataThreadChannel = await firstValueFrom(
        this.mainService.watchSingleThreadDoc(
          this.dataChannel.messageChannel[singleMessageIndex].thread,
          'threads',
        ),
      );
      this.dataThread = dataThreadChannel as Channel;
    } else {
      const dataThreadChannel = await firstValueFrom(
        this.mainService.watchSingleThreadDoc(
          this.dataChannel.id,
          'direct-message',
        ),
      );
      this.dataThread = dataThreadChannel as Channel;
    }
  }

  /**
   * Handles click events on the document by resetting the active message index. This method ensures that any active message interactions are closed when clicking outside of a specific UI component.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  /**
   * Sets the hovered message index when the mouse enters a specific UI element. This function updates the hoveredMessageIndex to reflect the index of the currently hovered message.
   */
  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

  /**
   * Resets the hovered message index when the mouse leaves a specific UI element. This function clears the hoveredMessageIndex to null, indicating no current message is being hovered over.
   */
  onMouseLeave(): void {
    this.hoveredMessageIndex = null;
  }

  /**
   * Opens a thread for a given message and initializes relevant properties.
   */
  async openThread(threadMessage: Message, indexSingleMessage: number) {
    this.activateThreadFocus();
    this.mainService
      .watchSingleThreadDoc(threadMessage.thread, 'threads')
      .subscribe((dataThreadChannel) => {
        this.dataThread = dataThreadChannel as Channel;
      });
    this.contentMessageOfThread = threadMessage;
    this.indexOfThreadMessageForEditChatMessage = indexSingleMessage;
    this.isThreadOpen = true;
    this.isWorkspaceOpen = false;
    this.closeMenu = this.isWorkspaceOpen ? 'arrow_drop_up' : 'arrow_drop_down';
    this.closeMenuText = this.isWorkspaceOpen
      ? 'Workspace-Menü schließen'
      : 'Workspace-Menü öffnen';
  }
}

