import {
  Component,
  inject,
  HostListener,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '../../../service/emoji.service';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { DirectMessageService } from '../../../service/direct-message.service';
import { LoginService } from '../../../service/login.service';
import { ChannelService } from '../../../service/channel.service';
import { Channel } from '../../../../assets/models/channel.class';
import { ThreadService } from '../../../service/thread.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { SearchFieldService } from '../../../service/search-field.service';

@Component({
  selector: 'app-mobile-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileHeaderComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './mobile-chat.component.html',
  styleUrl: './mobile-chat.component.scss',
})
export class MobileChatComponent implements OnInit {
  parmsId: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  private channelSubscription!: Subscription;
  textMobileChat: string = '';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public directMessageService: DirectMessageService,
    public loginService: LoginService,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public searchField: SearchFieldService,
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
    this.chatService.loggedInUser = this.mainService.loggedInUser;
    this.chatService.mobileChatIsOpen = true;
    this.textMobileChat = '';
    this.chatService.editTextMobile = '';
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    this.mainService.subscriptionTextChatMobile = this.mainService.currentContent.subscribe(
      (content) => {
        if (!this.chatService.editOpen) {
          this.textMobileChat += content;
        } else {
          this.chatService.editTextMobile += content;
        }
      },
    );
  }

  /**
   * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
   * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
   * This is typically used to ensure that the component has access to the latest user information when it is initialized.
   */
  async ngOnInit() {
    if (this.parmsId) {
      try {
        const channelData = await lastValueFrom(
          this.mainService.watchSingleChannelDoc(this.parmsId, 'channels'),
        );
        this.chatService.dataChannel = channelData as Channel;
      } catch (err) {
        console.error('Fehler beim Laden der Daten:', err);
      }
    }
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);
    });
    this.checkScreenSize(window.innerWidth);
  }

  /**
   * Handles window resize events by checking if the screen size exceeds a specific width.
   * This method is triggered whenever the window is resized.
   */
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize(window.innerWidth);
  }

  /**
   * Redirects to the main page if the screen width exceeds 960 pixels.
   * @param {number} width - The current width of the screen.
   */
  private checkScreenSize(width: number) {
    if (this.chatService.mobileChatIsOpen) {
      if (width > 960) {
        this.router.navigate(['/main', 'chat', this.chatService.dataChannel.id, 'user', 'chat',]);
        this.chatService.mobileDirectChatIsOpen = false;
        this.chatService.mobileThreadIsOpen = false;
      }
    }
  }

  /**
  * Lifecycle hook that is called after the view is initialized.
  * Subscribes to the channelChanged event to trigger scrolling to the bottom of the chat after a delay.
  */
  @ViewChild('autofocus') meinInputField!: ElementRef;
  ngAfterViewInit() {
    this.channelSubscription = this.chatService.channelChanged$.subscribe(
      () => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 400);
      },
    );
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
  }

  /**
   * Scrolls the content of the scrollable container to the bottom.
   * This is typically used to ensure the user sees the most recent messages or content added to the container.
   */
  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  /**
   * Navigates to a specified thread by ID.
   * This method subscribes to a single thread document from a service, updates the chat service's data thread,
   * and then navigates to the thread page using the router.
   *
   * @param {string} threadId - The unique identifier of the thread to navigate to.
   */
  navigateToThread(threadId: string) {
    this.chatService.editOpen = false;
    this.mainService.clearContentObservable()
    this.threadService.textThread = '';
    this.router.navigate(['/thread-mobile', this.chatService.dataChannel.id, threadId,]);
  }

  /**
 * A lifecycle hook that is called when the component is destroyed.
 * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
 */
  ngOnDestroy() {
    if (this.mainService.subscriptionTextChatMobile) {
      this.mainService.subscriptionTextChatMobile.unsubscribe();
    }
  }
}
