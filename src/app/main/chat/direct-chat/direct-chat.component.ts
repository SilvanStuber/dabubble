import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { EmojiService } from '../../../service/emoji.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { LoginService } from '../../../service/login.service';
import { ChannelService } from '../../../service/channel.service';
import { Channel } from '../../../../assets/models/channel.class';
import { lastValueFrom, Subscription } from 'rxjs';
import { SearchFieldService } from '../../../service/search-field.service';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileChatHeaderComponent,
  ],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss',
})
export class DirectChatComponent implements OnInit {
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  loggedInUser: User = new User();
  parmsIdContent: string = '';
  parmsIdUser: string = '';
  parmsIdOfChat: string = '';
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;
  private channelSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService,
    public directMessageService: DirectMessageService,
    private loginService: LoginService,
    public channelService: ChannelService,
    public searchField: SearchFieldService,
  ) {
    this.route.params.subscribe((params: any) => {
      this.parmsIdContent = params['id'];
      this.parmsIdUser = params['idUser'];
      this.parmsIdOfChat = params['idOfChat'];
    });
    if (!this.directMessageService.dataDirectMessage) {
      this.directMessageService.dataDirectMessage = {} as Channel;
    } else if (!this.directMessageService.dataDirectMessage.messageChannel) {
      this.directMessageService.dataDirectMessage.messageChannel = [];
    }
    setTimeout(() => {
      this.scrollToBottom();
    }, 400);
  }

  /**
   * Initializes the component by fetching the current logged-in user and subscribing to changes in the user's status.
   * Upon receiving an update, it creates a new User instance and assigns it to a service for use within the application.
   * This is typically used to ensure that the component has access to the latest user information when it is initialized.
   */
  async ngOnInit() {
    if (this.parmsIdContent) {
      try {
        const dataDirectChat = await lastValueFrom(this.mainService.watchSingleChannelDoc(this.parmsIdContent, 'direct-message',
        ),
        );
        this.chatService.dataChannel = dataDirectChat as Channel;
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
      }
    }
    if (this.parmsIdUser) {
      this.mainService.watchSingleChannelDoc(this.parmsIdUser, 'users').subscribe((dataUser) => { this.chatService.clickedUser = dataUser as User; });
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
  * Scrolls the content of the scrollable container to the bottom.
  * This is typically used to ensure the user sees the most recent messages or content added to the container.
  */
  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }

  /**
   * Redirects to the main page if the screen width exceeds 960 pixels.
   * @param {number} width - The current width of the screen.
   */
  private checkScreenSize(width: number) {
    if (width > 960) {
      this.router.navigate(['/main', 'chat', this.parmsIdOfChat, 'user', 'chat']);
      this.chatService.mobileDirectChatIsOpen = false;
      this.chatService.mobileThreadIsOpen = false;
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
   * Opens a user profile in a modal dialog using Angular Material's Dialog component.
   * The function configures the dialog to display details about a specified user.
   * @param {User} directUser - The user whose profile is to be displayed in the dialog.
   */
  openUserProfile(directUser: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = directUser;
    this.dialog.open(UserProfileComponent, dialogConfig);
  }
}
