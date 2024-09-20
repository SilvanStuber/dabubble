import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from '../../../service/chat.service';
import { ChannelService } from '../../../service/channel.service';
import { CommonModule } from '@angular/common';
import { MainServiceService } from '../../../service/main-service.service';
import { User } from '../../../../assets/models/user.class';
import { DirectMessageService } from '../../../service/direct-message.service';

@Component({
  selector: 'app-dialog-edit-channel',
  standalone: true,
  imports: [MatIconModule, FormsModule, CommonModule],
  templateUrl: './dialog-edit-channel.component.html',
  styleUrl: './dialog-edit-channel.component.scss',
})
export class DialogEditChannelComponent {
  @Output() contentChange = new EventEmitter<string>();
  constructor(
    public chatService: ChatService,
    public channelService: ChannelService,
    public mainService: MainServiceService,
    public directMessageService: DirectMessageService,
    private cdr: ChangeDetectorRef,
  ) {
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
   * Updates the name content.
   *
   * @param event - The event that triggered the update (optional).
   */
  updateNameContent(event?: Event): void {
    this.updateIsEmpty(this.channelService.content);
    if (!this.channelService.isEmpty) {
      this.contentChange.emit(this.channelService.content);
    }
  }

  /**
   * Updates the channel name content.
   * If the textareaChannelName is not empty, sets isChannelNameEmpty to false.
   * Otherwise, sets isChannelNameEmpty to true.
   */
  updateChannelNameContent() {
    if (this.channelService.textareaChannelName !== '') {
      this.channelService.isChannelNameEmpty = false;
    } else {
      this.channelService.isChannelNameEmpty = true;
    }
  }

  /**
   * Updates the channel description content.
   * If the textareaChannelDescription is not empty, sets isChannelDescriptionEmpty to false.
   * Otherwise, sets isChannelDescriptionEmpty to true.
   */
  updateChannelDescriptionContent() {
    if (this.channelService.textareaChannelDescription !== '') {
      this.channelService.isChannelDescriptionEmpty = false;
    } else {
      this.channelService.isChannelDescriptionEmpty = true;
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
    this.cdr.detectChanges();
  }
}
