import { Component, OnInit } from '@angular/core';
import { MobileHeaderComponent } from './header/mobile-header/mobile-header.component';
import { DesktopHeaderComponent } from './header/desktop-header/desktop-header.component';
import { CommonModule } from '@angular/common';
import { DesktopChatComponent } from './chat/desktop-chat/desktop-chat.component';
import { MobileChatComponent } from './chat/mobile-chat/mobile-chat.component';
import { DesktopThreadComponent } from './thread/desktop-thread/desktop-thread.component';
import { MobileThreadComponent } from './thread/mobile-thread/mobile-thread.component';
import { DesktopChannelsComponent } from './channels/desktop-channels/desktop-channels.component';
import { MobileChannelsComponent } from './channels/mobile-channels/mobile-channels.component';
import { MainServiceService } from '../service/main-service.service';
import { AddChannelComponent } from './channels/add-channel/add-channel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DirectChatComponent } from './chat/direct-chat/direct-chat.component';
import { MobileChatHeaderComponent } from './header/mobile-chat-header/mobile-chat-header.component';
import { MatIconModule } from '@angular/material/icon';
import { DesktopDirectChatComponent } from './chat/desktop-direct-chat/desktop-direct-chat.component';
import { DirectMessageService } from '../service/direct-message.service';
import { ChatService } from '../service/chat.service';
import { NewMessageComponent } from './new-message/mobile-new-message/new-message.component';
import { DesktopNewMessageComponent } from './new-message/desktop-new-message/desktop-new-message.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Channel } from '../../assets/models/channel.class';
import { User } from '../../assets/models/user.class';

import { take } from 'rxjs';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SearchFieldService } from '../service/search-field.service';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    MobileHeaderComponent,
    DesktopHeaderComponent,
    CommonModule,
    DesktopChatComponent,
    MobileChatComponent,
    DesktopThreadComponent,
    MobileThreadComponent,
    DesktopChannelsComponent,
    MobileChannelsComponent,
    AddChannelComponent,
    MatDialogModule,
    UserProfileComponent,
    DirectChatComponent,
    MobileChatHeaderComponent,
    MatIconModule,
    DesktopDirectChatComponent,
    NewMessageComponent,
    DesktopNewMessageComponent,
  ],
  animations: [
    trigger('slideRightInOut', [
      state(
        'in',
        style({
          width: '35%',
          display: 'block',
        }),
      ),
      state(
        'out',
        style({
          width: '0%',
          display: 'none',
        }),
      ),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in-out')]),
    ]),
    trigger('slideLeftInOut', [
      state(
        'in',
        style({
          width: '400px',
          display: 'block',
        }),
      ),
      state(
        'out',
        style({
          width: '0px',
          display: 'none',
        }),
      ),
      transition('in => out', [animate('200ms ease-in-out')]),
      transition('out => in', [animate('200ms ease-in-out')]),
    ]),
  ],
})
export class MainComponent implements OnInit {
  isThreadOpen: boolean = false;
  currentChannel: any = [];
  nameOfContent: string = '';
  parmsIdContent: string = '';
  parmsIdUser: string = '';

  constructor(
    public mainService: MainServiceService,
    public directMessage: DirectMessageService,
    public chatService: ChatService,
    public searchField: SearchFieldService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.nameOfContent = params['nameOfContent'];
      this.parmsIdContent = params['id'];
      this.parmsIdUser = params['idUser'];
    });
    if (this.nameOfContent === 'chat') {
      this.chatService.directChatOpen = false;
      this.chatService.desktopChatOpen = true;
      this.mainService
        .watchSingleChannelDoc(this.parmsIdContent, 'channels')
        .subscribe((dataChannel) => {
          this.chatService.dataChannel = dataChannel as Channel;
        });
    } else if (this.nameOfContent === 'direct-message') {
      if (!this.chatService.newMessageOpen) {
        this.chatService.directChatOpen = true;
      }
      this.chatService.desktopChatOpen = false;
      this.mainService
        .watchSingleChannelDoc(this.parmsIdContent, 'direct-message')
        .subscribe((dataChannel) => {
          this.chatService.dataChannel = dataChannel as Channel;
        });
      this.mainService
        .watchUsersDoc(this.parmsIdUser, 'users')
        .subscribe((dataUser) => {
          this.chatService.clickedUser = dataUser as User;
        });
    }
    this.searchField.setAllChannel();
  }

  /**
   * Toggles the state of the workspace and updates the menu icon and text accordingly.
   */
  closeOpenWorkspace() {
    this.chatService.isWorkspaceOpen = !this.chatService.isWorkspaceOpen;
    this.chatService.closeMenu = this.chatService.isWorkspaceOpen
      ? 'arrow_drop_up'
      : 'arrow_drop_down';
    this.chatService.closeMenuText = this.chatService.isWorkspaceOpen
      ? 'Workspace-Menü schließen'
      : 'Workspace-Menü öffnen';
  }
}
