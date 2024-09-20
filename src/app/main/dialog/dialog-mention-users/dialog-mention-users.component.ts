import { Component } from '@angular/core';
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
import { EmojiService } from '../../../service/emoji.service';
import { NewMessageService } from '../../../service/new-message.service';
import { ThreadService } from '../../../service/thread.service';

@Component({
  selector: 'app-dialog-mention-users',
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
  templateUrl: './dialog-mention-users.component.html',
  styleUrl: './dialog-mention-users.component.scss',
})
export class DialogMentionUsersComponent {
  inputContent = '';
  inputContentNewMessage = '';
  inputContentThread = '';
  inputContentDirect = '';

  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService,
    public newMessageService: NewMessageService,
    public threadService: ThreadService,
  ) {
    this.chatService = chatService;
  }

  /**
   * Adds a user mention to the input content and updates the appropriate content area, then closes the dialog.
   * @param {User} user - The user to be mentioned.
   */
  addMentionUser(user: User) {
    const lastChar = this.chatService.text.trim().slice(-1);
    if (lastChar !== '@') {
      this.inputContent += '@' + user.name + ' ';
    } else {
      this.inputContent += user.name;
    }

    const lastCharDirect = this.chatService.directText.trim().slice(-1);
    if (lastCharDirect !== '@') {
      this.inputContentDirect += '@' + user.name + ' ';
    } else {
      this.inputContentDirect += user.name;
    }

    const lastCharNewMessage = this.newMessageService.textNewMessage
      .trim()
      .slice(-1);
    if (lastCharNewMessage !== '@') {
      this.inputContentNewMessage += '@' + user.name + ' ';
    } else {
      this.inputContentNewMessage += user.name;
    }

    const lastCharThread = this.threadService.textThread.trim().slice(-1);
    if (lastCharThread !== '@') {
      this.inputContentThread += '@' + user.name + ' ';
    } else {
      this.inputContentThread += user.name;
    }
    this.validationContent();
  }

  /**
   * Validates and updates the input content based on the current service type.
   * Updates content for channel, thread, or direct message, then resets the content.
   */
  validationContent() {
    if (this.mainService.contentToChannel) {
      this.mainService.changeInputContent(this.inputContent);
    } else if (this.mainService.contentToThread) {
      this.mainService.changeInputContentThread(this.inputContentThread);
    } else if (this.mainService.contentToDirectMessage) {
      this.mainService.changeInputContentDirectChat(this.inputContentDirect);
    } else if (this.mainService.contentToNewMessage) {
      this.mainService.changeInputContentNewMessage(
        this.inputContentNewMessage,
      );
    }
    this.resetContent();
  }

  /**
   * Resets content flags for channel, direct message, and thread.
   * Closes the chat dialog after resetting the flags.
   */
  resetContent() {
    this.mainService.contentToChannel = false;
    this.mainService.contentToDirectMessage = false;
    this.mainService.contentToThread = false;
    this.mainService.contentToNewMessage = false;
    this.chatService.closeDialog();
  }
}

