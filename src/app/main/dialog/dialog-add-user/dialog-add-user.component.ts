import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../service/chat.service';
import { User } from '../../../../assets/models/user.class';
import { MainServiceService } from '../../../service/main-service.service';
import { ChannelService } from '../../../service/channel.service';

@Component({
  selector: 'app-dialog-add-user',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    CommonModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './dialog-add-user.component.html',
  styleUrl: './dialog-add-user.component.scss',
})
export class DialogAddUserComponent {
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('container') container!: ElementRef;

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    public channelService: ChannelService,
    private cdr: ChangeDetectorRef,
  ) {
    this.chatService = chatService;
    this.channelService.pushUserToEditList();
  }

  /**
   * Initializes the component by checking if it is empty. If it is, sets the content to a placeholder.
   * This method is called once during the component's lifecycle, when the component is being initialized.
   */
  ngOnInit() {
    this.updateIsEmpty();
    if (this.channelService.isEmpty) {
      this.channelService.content = this.channelService.placeholder;
    }
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
    this.calculateHeight();
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
