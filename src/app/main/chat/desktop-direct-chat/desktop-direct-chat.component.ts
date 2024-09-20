import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { Subscription } from 'rxjs';
import { DialogShowsUserReactionComponent } from '../../dialog/dialog-shows-user-reaction/dialog-shows-user-reaction.component';
import { Firestore } from '@angular/fire/firestore';
import { ChannelService } from '../../../service/channel.service';
import { LoginService } from '../../../service/login.service';
import { ThreadService } from '../../../service/thread.service';
import { Channel } from '../../../../assets/models/channel.class';
import { SearchFieldService } from '../../../service/search-field.service';


@Component({
  selector: 'app-desktop-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './desktop-direct-chat.component.html',
  styleUrl: './desktop-direct-chat.component.scss',
})
export class DesktopDirectChatComponent implements OnInit {
  loggedInUser: User = new User();
  private channelSubscription!: Subscription;
  parmsId: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?:
    | MatDialogRef<DialogEmojiComponent>
    | MatDialogRef<DialogShowsUserReactionComponent>;

  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  emojiReactionIndexHover: number | null = null;
  activeMessageIndexReacton: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public directMessageService: DirectMessageService,
    public channelService: ChannelService,
    public loginService: LoginService,
    public threadService: ThreadService,
    public searchField: SearchFieldService,
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
    this.chatService.loggedInUser = this.mainService.loggedInUser;
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    this.mainService.subscriptionDirectChat =
      this.mainService.currentContentDirectChat.subscribe((content) => {
        if (!this.chatService.editOpen) {
          this.chatService.directText += content;
        } else {
          this.chatService.editText += content;
        }
      });
  }

  /**
   * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
   * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
   * This is typically used to ensure that the component has access to the latest user information when it is initialized.
   */
  ngOnInit() {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
  }

  /** Stores the last scroll height of the container to detect changes. */
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

  /**
   * Lifecycle hook that is called after every check of the component's view.
   * Checks if the scrollHeight of the container has increased since the last check,
   * indicating that new content might have been added. If so, it scrolls to the bottom of the container
   * and updates the last known scrollHeight.
   */
  ngAfterViewChecked() {
    if (
      this.scrollContainer.nativeElement.scrollHeight > this.lastScrollHeight ||
      this.chatService.sendetMessage ||
      this.directMessageService.switchContent
    ) {
      this.scrollToBottom();
      this.lastScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
      this.directMessageService.switchContent = false;
    }
  }

  /** @ViewChild decorator to access and manage focus on the input field. */
  @ViewChild('autofocus') meinInputField!: ElementRef;

  /**
   * Initializes components after Angular has fully initialized the view.
   * It sets focus to an input field and subscribes to channel change notifications
   * to refocus as needed.
   */
  ngAfterViewInit() {
    this.focusInputField();
    this.channelSubscription = this.chatService.channelChanged$.subscribe(
      () => {
        this.focusInputField();
      },
    );
  }

  /**
   * Focuses on the designated input field.
   * A delay ensures the action is processed within the Angular event lifecycle.
   */
  private focusInputField() {
    setTimeout(() => {
      this.meinInputField.nativeElement.focus();
    }, 0);
  }

  /**
   * Scrolls the content of the scrollable container to the bottom.
   * This is typically used to ensure the user sees the most recent messages or content added to the container.
   */
  scrollToBottom(): void {
    if (!this.chatService.fromDirectChat) {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    }
    setTimeout(() => {
      this.chatService.fromDirectChat = false;
    }, 1000);
  }

  /**
   * Toggles the hover state for an emoji reaction container associated with a chat message.
   * Prevents event propagation to manage interaction effects locally.
   */
  toggleIconHoverContainerChat(
    singleMessageIndex: number,
    emojiUserIndex: number,
    event: MouseEvent,
  ) {
    event.stopPropagation();
    this.activeMessageIndexReacton = singleMessageIndex;
    this.emojiReactionIndexHover = emojiUserIndex;
  }

  /**
   * Resets the hover state for the emoji reaction containers when the mouse leaves.
   */
  toggleIconHoverContainerChatOut(event: MouseEvent) {
    this.activeMessageIndexReacton = null;
    this.emojiReactionIndexHover = null;
  }

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    if (this.mainService.subscriptionDirectChat) {
      this.mainService.subscriptionDirectChat.unsubscribe();
    }
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }

  /**
   * Checks if the Enter key is pressed without the Shift key to send a message.
   * If the condition is met, it prevents the default action and sends a message.
   */
  checkForEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.directMessageService.sendMessageFromDirectMessage(
        this.chatService.dataChannel.id,
        this.chatService.directText,
        this.chatService.imageMessage,
      );
    }
  }

  /**
   * Opens a user profile in a modal dialog using Angular Material's Dialog component.
   * The function configures the dialog to display details about a specified user.
   * @param {User} directUser - The user whose profile is to be displayed in the dialog.
   */
  openUserProfile(directUser: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = directUser;
    this.dialog.open(UserProfileComponent, dialogConfig);
  }

  /**
   * Sends a direct message using the directMessageService.
   * Marks the message as sent from the desktop and includes text and image data.
   */
  sendDirectMessage() {
    this.directMessageService.sendNewMessageFromDesktop = true;
    this.directMessageService.sendMessageFromDirectMessage(
      this.chatService.dataChannel.id,
      this.chatService.directText,
      this.chatService.imageMessage,
    );
  }
}

