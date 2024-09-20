import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { MainServiceService } from '../../../service/main-service.service';
import { LoginService } from '../../../service/login.service';
import { ChatService } from '../../../service/chat.service';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { User } from '../../../../assets/models/user.class';
import { ActivatedRoute } from '@angular/router';
import { DirectMessageService } from '../../../service/direct-message.service';
import { ChannelService } from '../../../service/channel.service';
import { CommonModule } from '@angular/common';
import { EmojiService } from '../../../service/emoji.service';
import { ThreadService } from '../../../service/thread.service';
import { Channel } from '../../../../assets/models/channel.class';
import { lastValueFrom, Subscription, take } from 'rxjs';
import { SearchFieldService } from '../../../service/search-field.service';


@Component({
  selector: 'app-desktop-thread',
  standalone: true,
  imports: [FormsModule, MatIcon, CommonModule],
  templateUrl: './desktop-thread.component.html',
  styleUrl: './desktop-thread.component.scss',
})
export class DesktopThreadComponent implements OnInit {
  parmsId = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  private channelSubscription!: Subscription;
  scrollStarted: boolean = false;

  @ViewChild('scrollContainerThread') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

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
  }

  /**
   * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
   * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
   * This is typically used to ensure that the component has access to the latest user information when it is initialized.
   */
  async ngOnInit() {
    if (this.chatService.isThreadOpen) {
      const threadData = await lastValueFrom(
        this.mainService.watchSingleThreadDoc(
          this.chatService.dataChannel.messageChannel[
            this.chatService.indexOfThreadMessageForEditChatMessage
          ].thread,
          'threads',
        ),
      );
      this.chatService.dataThread = threadData as Channel;
      this.loginService.currentLoggedUser();
      this.loginService.loggedInUser$.pipe(take(1)).subscribe((user) => {
        this.mainService.loggedInUser = new User(user);
      });
    }
    this.mainService.subscriptionThreadContent =
      this.mainService.currentContentThread.subscribe((content) => {
        if (!this.chatService.editOpen) {
          this.threadService.textThread += content;
        } else {
          this.threadService.editTextThread += content;
        }
      });
  }

  /**
   * Lifecycle hook that is called after every check of the component's view.
   * Checks if the scrollHeight of the container has increased since the last check,
   * indicating that new content might have been added. If so, it scrolls to the bottom of the container
   * and updates the last known scrollHeight.
   */
  ngAfterViewChecked() {
    if (
      this.scrollContainer.nativeElement.scrollHeight > this.lastScrollHeight &&
      this.chatService.sendetMessage
    ) {
      this.scrollToBottom();
      this.lastScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
    }
    this.channelSubscription = this.chatService.threadChanged$.subscribe(() => {
      if (!this.scrollStarted) {
        this.scrollStarted = true;
        setTimeout(() => {
          this.scrollToBottom();
        }, 400);
      }
    });
  }

  /**
   * Scrolls the content of the scrollable container to the bottom.
   * This is typically used to ensure the user sees the most recent messages or content added to the container.
   */
  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
    this.scrollStarted = false;
  }

  /**
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    if (this.mainService.subscriptionThreadContent) {
      this.mainService.subscriptionThreadContent.unsubscribe();
    }
  }

  /**
   * Toggles the hover state for an emoji reaction container in a message thread.
   * Stops the propagation of the mouse event to handle interactions locally.
   */
  toggleIconHoverContainerThread(
    singleMessageIndex: number,
    emojiUserIndex: number,
    event: MouseEvent,
  ) {
    event.stopPropagation();
    this.chatService.activeMessageIndexReactonThread = singleMessageIndex;
    this.chatService.emojiReactionIndexHoverThread = emojiUserIndex;
  }

  /**
   * Resets the hover state for emoji reaction containers in a message thread when the mouse exits.
   * Clears the indices tracking the active message and emoji reaction.
   * @param {MouseEvent} event - The mouse event that triggers the state reset.
   */
  toggleIconHoverContainerThreadOut(event: MouseEvent) {
    this.chatService.activeMessageIndexReactonThread = null;
    this.chatService.emojiReactionIndexHoverThread = null;
  }

  /**
   * Checks for the 'Enter' key press without the 'Shift' key to send a message in a thread.
   * If the condition is met, the default action of the key press is prevented and a message is sent.
   * @param {KeyboardEvent} event - The keyboard event to evaluate.
   */
  checkForEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.threadService.sendMessageFromThread(
        this.chatService.dataThread.id,
        this.threadService.textThread,
        this.threadService.imageMessage,
      );
    }
  }
}

