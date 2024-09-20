import { Component } from '@angular/core';
import { ChatService } from '../../../service/chat.service';
import { MainServiceService } from '../../../service/main-service.service';
import { EmojiService } from '../../../service/emoji.service';
import { NewMessageService } from '../../../service/new-message.service';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Channel } from '../../../../assets/models/channel.class';
import { ChannelService } from '../../../service/channel.service';
import { ThreadService } from '../../../service/thread.service';

@Component({
  selector: 'app-dialog-search-channels',
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
  templateUrl: './dialog-search-channels.component.html',
  styleUrl: './dialog-search-channels.component.scss',
})
export class DialogSearchChannelsComponent {
  constructor(
    public chatService: ChatService,
    public mainService: MainServiceService,
    public emojiService: EmojiService,
    public newMessageService: NewMessageService,
    public channelService: ChannelService,
    public threadService: ThreadService,
  ) { }

  inputContent = '';
  inputContentNewMessage = '';
  inputContentThread = '';
  inputContentDirect = '';

  addSearchChannel(channel: Channel) {
    const lastChar = this.chatService.text.trim().slice(-1);
    if (lastChar !== '#') {
      this.inputContent += '#' + channel.name + ' ';
    } else {
      this.inputContent += channel.name;
    }

    const lastCharDirect = this.chatService.directText.trim().slice(-1);
    if (lastCharDirect !== '#') {
      this.inputContentDirect += '#' + channel.name + ' ';
    } else {
      this.inputContentDirect += channel.name;
    }

    const lastCharNewMessage = this.newMessageService.textNewMessage
      .trim()
      .slice(-1);
    if (lastCharNewMessage !== '#') {
      this.inputContentNewMessage += '#' + channel.name + ' ';
    } else {
      this.inputContentNewMessage += channel.name;
    }

    const lastCharThread = this.threadService.textThread.trim().slice(-1);
    if (lastCharThread !== '#') {
      this.inputContentThread += '#' + channel.name + ' ';
    } else {
      this.inputContentThread += channel.name;
    }
    this.validationContent();
  }

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

  resetContent() {
    this.mainService.contentToChannel = false;
    this.mainService.contentToDirectMessage = false;
    this.mainService.contentToThread = false;
    this.mainService.contentToNewMessage = false;
    this.channelService.closeDialog();
  }
}

