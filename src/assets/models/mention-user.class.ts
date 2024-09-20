import { User } from './user.class';
export class MentionUser {
  mentionUser: User[] = [];

  constructor(obj?: any) {
    this.mentionUser = obj?.mentionUser || [];
  }

  public toJSON() {
    return {
      mentionUser: this.mentionUser.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })),
    };
  }
}
