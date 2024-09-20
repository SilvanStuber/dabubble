export class Emoji {
  emoji: string;
  user: string[] = [];
  userName: string[] = [];
  userAvatar: string[];

  constructor(obj?: any) {
    this.emoji = obj ? obj.emoji : '';
    this.user = obj ? obj.user : [];
    this.userName = obj ? obj.userName : [];
    this.userAvatar = obj ? obj.userAvatar : [];
  }

  public toJSON() {
    return {
      emoji: this.emoji,
      user: this.user,
      userName: this.userName,
      userAvatar: this.userAvatar,
    };
  }
}
