import { Component, inject } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MainServiceService } from '../../../service/main-service.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ChatService } from '../../../service/chat.service';
import { EmojiService } from '../../../service/emoji.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-emoji',
  standalone: true,
  imports: [
    PickerComponent,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-emoji.component.html',
  styleUrl: './dialog-emoji.component.scss',
})
export class DialogEmojiComponent {
  public dialogRef = inject(MatDialogRef<DialogEmojiComponent>);
  constructor(
    public mainService: MainServiceService,
    public chatService: ChatService,
    public emojiService: EmojiService,
  ) { }
  inputContent: any;

  /**
   * Adds an emoji as a reaction to a message or input, then closes the dialog.
   * @param {any} event - The event containing the emoji information.
   */
  addEmoji(event: any) {
    if (!this.mainService.emojiReactionMessage) {
      this.setInputReaction(event);
    } else {
      this.setMessageReaction(event);
    }
    this.chatService.closeDialog();
  }

  /**
   * Updates the input content with an emoji based on the event context.
   * @param {any} event - The event containing the emoji information.
   */
  setInputReaction(event: any) {
    this.inputContent = event.emoji.native + ' ';
    if (this.emojiService.emojiToChannel) {
      this.mainService.changeInputContent(this.inputContent);
    } else if (this.emojiService.emojieToThread) {
      this.mainService.changeInputContentThread(this.inputContent);
    } else if (this.emojiService.emojiToDirectMessage) {
      this.mainService.changeInputContentDirectChat(this.inputContent);
    } else if (this.emojiService.emojieToNewMessage) {
      this.mainService.changeInputContentNewMessage(this.inputContent);
    }
  }

  /**
   * Adds an emoji reaction to a message in a channel or thread.
   * @param {any} event - The event containing the emoji information.
   */
  setMessageReaction(event: any) {
    if (
      this.emojiService.emojiToChannel ||
      this.emojiService.emojiToDirectMessage
    ) {
      this.emojiService.addReactionToMessageChannel(
        event.emoji.native,
        this.chatService.indexOfChannelMessage,
      );
    } else if (this.emojiService.emojieToThread) {
      this.emojiService.addReactionToMessageThread(
        event.emoji.native,
        this.chatService.indexOfThreadMessage,
      );
    }
  }

  /**
   * Closes the currently open dialog.
   * @method closeDialog
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
