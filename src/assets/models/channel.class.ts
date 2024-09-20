import { Message } from './message.class';
import { User } from './user.class';

export class Channel {
  subscribe(arg0: (data: any) => void) {
    throw new Error('Method not implemented.');
  }
  id: string;
  openingDate: number;
  name: string;
  description: string;
  channelUsers: User[] = [];
  messageChannel: Message[] = [];
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  avatarChannel: string;
  mentionUser: string;
  thread: string;
  ownerUser: User[] = [];
  idOfChannelOnThred: string;

  constructor(obj?: any) {
    this.id = obj?.id || '';
    this.openingDate = obj?.openingDate || '';
    this.name = obj?.name || '';
    this.description = obj?.description || '';
    this.channelUsers = obj?.channelUsers || [];
    this.messageChannel = obj?.messageChannel || [];
    this.userId = obj?.userId || '';
    this.userName = obj?.userName || '';
    this.userEmail = obj?.userEmail || '';
    this.userAvatar = obj?.userAvatar || '';
    this.avatarChannel = obj?.avatar || '';
    this.mentionUser = obj?.mentionUser || [];
    this.thread = obj?.thread || '';
    this.ownerUser = obj?.ownerUser || [];
    this.idOfChannelOnThred = obj?.idOfChannelOnThred || '';
  }

  public toJSON() {
    return {
      id: this.id,
      openingDate: this.openingDate,
      name: this.name,
      description: this.description,
      channelUsers: this.channelUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
      messageChannel: this.messageChannel.map((message) => ({
        userId: message.userId,
        userName: message.userName,
        userEmail: message.userEmail,
        userAvatar: message.userAvatar,
        date: message.date,
        message: message.message,
        emojiReaction: message.emojiReaction,
        imageToMessage: message.imageToMessage,
        mentionUser: message.mentionUser,
        thread: message.thread,
        numberOfMessage: message.numberOfMessage,
        dateOfLastThreadMessage: message.dateOfLastThreadMessage,
      })),
      avatarChannel: this.avatarChannel,
      ownerUser: this.ownerUser.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
      idOfChannelOnThred: this.idOfChannelOnThred,
    };
  }
}
