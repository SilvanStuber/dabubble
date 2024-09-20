import {
  Component,
  ElementRef,
  inject,
  ViewChild,
  HostListener,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogEmojiComponent } from '../../dialog/dialog-emoji/dialog-emoji.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainServiceService } from '../../../service/main-service.service';
import { ChatService } from '../../../service/chat.service';
import { MobileHeaderComponent } from '../../header/mobile-header/mobile-header.component';
import { CommonModule } from '@angular/common';
import { Firestore, docData } from '@angular/fire/firestore';
import { Message } from '../../../../assets/models/message.class';
import { User } from '../../../../assets/models/user.class';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiService } from '../../../service/emoji.service';
import { MobileChatHeaderComponent } from '../../header/mobile-chat-header/mobile-chat-header.component';
import { Channel } from '../../../../assets/models/channel.class';
import { NewMessageService } from '../../../service/new-message.service';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ThreadService } from '../../../service/thread.service';
import { getAuth, signOut } from '@angular/fire/auth';
import { LoginService } from '../../../service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { SearchFieldService } from '../../../service/search-field.service';

@Component({
  selector: 'app-new-message',
  standalone: true,
  imports: [
    MatIconModule,
    FormsModule,
    MobileHeaderComponent,
    CommonModule,
    PickerComponent,
    MobileHeaderComponent,
    MobileChatHeaderComponent,
    UserProfileComponent,
  ],
  templateUrl: './new-message.component.html',
  styleUrl: './new-message.component.scss',
})
export class NewMessageComponent implements OnInit {
  items$;
  items;
  parmsId: string = '';
  public dialog = inject(MatDialog);
  dialogInstance?: MatDialogRef<DialogEmojiComponent>;
  subscription;
  dialogOpen = false;
  firestore: Firestore = inject(Firestore);
  messageToChannel: Message = new Message();
  loggedInUser: User = new User();
  activeMessageIndex: number | null = null;
  hoveredMessageIndex: number | null = null;
  userMenu: boolean = false;
  userData: any;
  channelData: any;
  allChannel: Channel[] = [];
  currentUser: any;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatService,
    public emojiService: EmojiService,
    public mainService: MainServiceService,
    public searchField: SearchFieldService,
    public newMessageService: NewMessageService,
    public dialogRef: MatDialogRef<NewMessageComponent>,
    public threadService: ThreadService,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.newMessageService.textNewMessage = '';
    this.route.params.subscribe((params: any) => {
      this.parmsId = params.id;
      chatService.idOfChannel = params.id;
    });
    if (this.parmsId) {
      this.items$ = docData(mainService.getDataRef(this.parmsId, 'channels'));
      this.items = this.items$.pipe(take(1)).subscribe((channel: any) => {
        this.chatService.dataChannel = channel;
      });
    }
    this.subscription = mainService.currentContent.subscribe((content) => {
      this.newMessageService.textNewMessage += content;
    });
    this.loggedInUser = mainService.loggedInUser;
  }
  ngOnInit(): void {
    this.subscription = this.searchField.allChannel$.subscribe((channels) => {
      this.allChannel = channels;
    });

    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.currentUser = user;
      this.mainService.loggedInUser = new User(user);
    });
  }

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private lastScrollHeight = 0;

  /**
   * Toggles the icon container based on the provided index and event.
   *
   * @param index - The index of the icon container.
   * @param event - The mouse event that triggered the toggle.
   */
  toggleIconContainer(index: number, event: MouseEvent): void {
    event.stopPropagation();
    if (this.activeMessageIndex === index) {
      this.activeMessageIndex = null;
    } else {
      this.activeMessageIndex = index;
    }
  }

  @HostListener('document:click', ['$event'])
  /**
   * Handles the click event on the document.
   */
  onDocumentClick(): void {
    this.activeMessageIndex = null;
  }

  /**
   * Handles the mouse enter event for a message.
   *
   * @param index - The index of the message being hovered.
   */
  onMouseEnter(index: number): void {
    this.hoveredMessageIndex = index;
  }

  /**
   * Event handler for the mouse leave event.
   */
  onMouseLeave(): void {
    this.hoveredMessageIndex = null;
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
   * A lifecycle hook that is called when the component is destroyed.
   * Used for any custom cleanup that needs to occur when the component is taken out of the DOM.
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  /**
   * Toggles the user menu.
   */
  openUserMenu() {
    this.userMenu = !this.userMenu;
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
   * Opens the user profile dialog.
   */
  openUserProfile() {
    this.dialog.open(UserProfileComponent);
  }

  /**
   * Logs out the user.
   *
   * @remarks
   * This method logs out the user by calling the `logoutUser` method of the `loginService` and then navigating to the login page.
   */
  logout() {
    this.threadService.closeThread();
    const auth = getAuth();
    this.loginService.logoutUser(auth);

    signOut(auth).then(() => {
      this.router.navigate(['login']);
    });
  }
}
