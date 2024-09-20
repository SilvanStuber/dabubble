import { Injectable, OnInit } from '@angular/core';
import {
  collection,
  DocumentData,
  Firestore,
  onSnapshot,
  QuerySnapshot,
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';
import { ChatService } from './chat.service';
import { MainServiceService } from './main-service.service';
import { LoginService } from './login.service';
import { ChannelService } from './channel.service';
import { Channel } from '../../assets/models/channel.class';
import { User } from '../../assets/models/user.class';


@Injectable({
  providedIn: 'root',
})
export class SearchFieldService implements OnInit {
  allUser: User[] = [];
  filterUser: DocumentData[] = [];
  filterChannel: DocumentData[] = [];
  filterMessage: DocumentData[] = [];

  public allChannelSubject = new BehaviorSubject<Channel[]>([]);
  public allChannel$ = this.allChannelSubject.asObservable();

  isSearchActive = false;
  at: any;

  constructor(
    private firestore: Firestore,
    private chatService: ChatService,
    private mainService: MainServiceService,
    private loginService: LoginService,
    private channelService: ChannelService,
  ) {
    this.loginService.currentLoggedUser();
    this.loginService.loggedInUser$.subscribe((user) => {
      this.mainService.loggedInUser = new User(user);

      if (user) {
        this.setAllChannel();
      }
    });
  }

  ngOnInit(): void {
    this.setAllUser();
  }

  /**
   *
   * After entering a query in the search field, the data is filtered.
   */
  filterData(searchValue: string) {
    this.setUser(searchValue);
    this.setChannel(searchValue);
  }

  filterDataChannelchat(searchValue: string) {
    const lastChar = searchValue.trim().slice(-1);

    if (lastChar == '@') {
      this.mainService.contentOfWhichInput('channels');
      this.chatService.openDialogMentionUser();
    } else {
      this.chatService.closeDialog();
    }

    if (lastChar == '#') {
      this.mainService.contentOfWhichInput('channels');
      this.channelService.openDialogSearchChannels();
    } else {
      this.channelService.closeDialog();
    }
  }

  filterDataDirectchat(searchValue: string) {
    const lastChar = searchValue.trim().slice(-1);

    if (lastChar == '@') {
      this.mainService.contentOfWhichInput('direct-message');
      this.chatService.openDialogMentionUser();
    } else {
      this.chatService.closeDialog();
    }

    if (lastChar == '#') {
      this.mainService.contentOfWhichInput('direct-message');
      this.channelService.openDialogSearchChannels();
    } else {
      this.channelService.closeDialog();
    }
  }

  filterDataNewMessagechat(searchValue: string) {
    const lastChar = searchValue.trim().slice(-1);

    if (lastChar == '@') {
      this.mainService.contentOfWhichInput('newMessage');
      this.chatService.openDialogMentionUser();
    } else {
      this.chatService.closeDialog();
    }

    if (lastChar == '#') {
      this.mainService.contentOfWhichInput('newMessage');
      this.channelService.openDialogSearchChannels();
    } else {
      this.channelService.closeDialog();
    }
  }

  filterDataThreadchat(searchValue: string) {
    const lastChar = searchValue.trim().slice(-1);

    if (lastChar == '@') {
      this.mainService.contentOfWhichInput('thread');
      this.chatService.openDialogMentionUser();
    } else {
      this.chatService.closeDialog();
    }

    if (lastChar == '#') {
      this.mainService.contentOfWhichInput('thread');
      this.channelService.openDialogSearchChannels();
    } else {
      this.channelService.closeDialog();
    }
  }

  filterNewMessage(searchValue: string) {
    if (searchValue.startsWith('@')) {
      this.setAllUser();
    } else if (searchValue.startsWith('#')) {
      this.setAllChannel();
    }
  }

  /**
   *
   * This function loads user data from Firestore and then filters it based on the search field input.
   * @returns - Data is being loaded from Firestore.
   */
  setUser(searchValue: string) {
    const docRef = collection(this.firestore, 'users');
    return onSnapshot(docRef, (userList: QuerySnapshot<DocumentData>) => {
      this.filterUser = [];
      userList.forEach((user) => {
        const userData = user.data();
        if (userData && userData['name'] && searchValue) {
          const name = userData['name'].toLowerCase();
          const searchValueLower = searchValue.toLowerCase();
          if (name.includes(searchValueLower)) {
            this.filterUser.push(userData);
          }
        }
      });
    });
  }

  setAllUser() {
    const docRef = collection(this.firestore, 'users');
    return onSnapshot(docRef, (channelList) => {
      this.allUser = [];
      channelList.forEach((channel) => {
        const userData = new User(channel.data());
        this.allUser.push(userData);
      });
    });
  }

  setAllChannel() {
    const docRef = collection(this.firestore, 'channels');
    return onSnapshot(docRef, (channelList) => {
      const channels: Channel[] = [];
      channelList.forEach((channel) => {
        const channelData = new Channel(channel.data());
        if (
          channelData.channelUsers.some(
            (channeluser: User) =>
              channeluser.id === this.mainService.loggedInUser.id,
          )) {
          channels.push(channelData);
        }
      });
      this.allChannelSubject.next(channels);
      console.log()
    });
  }

  /**
   *
   * This function loads user data from Firestore and then filters it based on the search field input.
   * @returns - Data is being loaded from Firestore.
   */
  setChannel(searchValue: string) {
    const docRef = collection(this.firestore, 'channels');
    return onSnapshot(docRef, (channelList: QuerySnapshot<DocumentData>) => {
      this.filterChannel = [];
      this.filterMessage = [];

      channelList.forEach((channel) => {
        const channelData = channel.data();

        if (channelData && channelData['name'] && searchValue) {
          const name = channelData['name'].toLowerCase();
          const searchValueLower = searchValue.toLowerCase();
          if (name.includes(searchValueLower)) {
            if (
              channelData['channelUsers'].some(
                (channeluser: User) =>
                  channeluser['id'] === this.mainService.loggedInUser.id,
              )
            ) {
              this.filterChannel.push(channelData);
            }
          }
        }

        if (channelData && channelData['messageChannel'] && searchValue) {
          channelData['messageChannel'].forEach(
            (message: { [x: string]: string }) => {
              const messageLower = message['message'].toLowerCase();
              const searchValueLower = searchValue.toLowerCase();
              if (messageLower.includes(searchValueLower)) {
                if (
                  channelData['channelUsers'].some(
                    (channeluser: User) =>
                      channeluser['id'] === this.mainService.loggedInUser.id,
                  ) ||
                  channelData['ownerUser'].some(
                    (channeluser: User) =>
                      channeluser['id'] === this.mainService.loggedInUser.id,
                  )
                ) {
                  this.filterMessage.push({
                    channelData: channelData,
                    channelName: channelData['name'],
                    message: message['message'],
                  });
                }
              }
            },
          );
        }
      });
    });
  }

  chooseUser(name: string) {
    const atIndex = this.chatService.text.lastIndexOf('@');
    if (atIndex !== -1) {
      this.chatService.text =
        this.chatService.text.slice(0, atIndex + 1) + name + ' ';
      this.filterUser = [];
    }
  }
}

