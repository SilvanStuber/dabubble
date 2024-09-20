import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmojiService } from '../../../service/emoji.service';
import { Emoji } from '../../../../assets/models/emoji.class';
import { ChannelService } from '../../../service/channel.service';
import { DirectMessageService } from '../../../service/direct-message.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-shows-user-reaction',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './dialog-shows-user-reaction.component.html',
  styleUrl: './dialog-shows-user-reaction.component.scss',
})
export class DialogShowsUserReactionComponent {
  constructor(
    public emojiService: EmojiService,
    public channelService: ChannelService,
    public directMessageService: DirectMessageService,
  ) {}

  openUser(id: string) {
    this.directMessageService.openProfil(id);
  }
}
