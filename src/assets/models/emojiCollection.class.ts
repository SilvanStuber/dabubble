import { Emoji } from './emoji.class';

export class EmojiCollection {
  emojis: Emoji[] = [];

  constructor(obj?: any) {
    this.emojis = obj ? obj.emojis : [];
  }

  public toJSON() {
    return {
      emojis: this.emojis.map((emoji) => ({
        emoji: emoji.emoji,
        user: emoji.user,
      })),
    };
  }
}
