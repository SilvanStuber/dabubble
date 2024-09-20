export class Message {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  date: number;
  message: string;
  imageToMessage: ArrayBuffer;
  mentionUser: string[] = [];
  thread: string = '';
  users0fTheEmoji: string[] = [];
  user0fTheEmoji: string[] = [];
  userIdEmoji: string[] = [];
  user: string[] = [];
  emojiReaction: {
    emoji: string;
    user: string[];
    userName: string[];
    userAvatar: string[];
  }[] = [];
  numberOfMessage: number;
  dateOfLastThreadMessage: number;

  constructor(obj?: any) {
    this.userId = obj?.userId || '';
    this.userName = obj?.userName || '';
    this.userEmail = obj?.userEmail || '';
    this.userAvatar = obj?.userAvatar || '';
    this.date = obj ? obj.data : '';
    this.message = obj ? obj.email : '';
    this.imageToMessage = obj ? obj.imageToMessage : '';
    this.user = obj?.user || [];
    this.emojiReaction = obj ? obj.emojiReaction : [];
    this.numberOfMessage = obj ? obj.numberOfMessage : '';
    this.dateOfLastThreadMessage = obj ? obj.dateOfLastThreadMessage : '';
  }

  public toJSON() {
    return {
      userId: this.userId,
      userName: this.userName,
      userEmail: this.userEmail,
      userAvatar: this.userAvatar,
      nameUser: this.userName,
      date: this.date,
      message: this.message,
      imageToMessage: this.imageToMessage,
      users0fTheEmoji: this.user0fTheEmoji,
      mentionUser: this.mentionUser,
      thread: this.thread,
      numberOfMessage: this.numberOfMessage,
      dateOfLastThreadMessage: this.dateOfLastThreadMessage,
      emojiReaction: this.emojiReaction,
    };
  }
}
