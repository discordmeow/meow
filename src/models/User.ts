interface ReceivedUserStructure {
  id: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  // flags?: number;
  premium_type?: number;
  public_flags?: number;
}

export class User {
  readonly id: string;
  readonly username?: string;
  readonly discriminator?: string;
  readonly avatarHash?: string;
  readonly isBot?: boolean;
  readonly isSystem?: boolean;
  readonly hasMFA?: boolean;
  readonly locale?: string;
  // readonly flags?: number;
  readonly premiumType?: number;
  readonly publicFlags?: number;

  constructor(structure: ReceivedUserStructure) {
    this.id = structure.id;
    this.username = structure.username;

    if (!this.isPartial) {
      this.discriminator = structure.discriminator;
      this.avatarHash = structure.avatar;
      this.isBot = structure.bot;
      this.isSystem = structure.system;
      this.hasMFA = structure.mfa_enabled;
      this.locale = structure.locale;
      // this.flags = structure.flags;
      this.premiumType = structure.premium_type;
      this.publicFlags = structure.public_flags;
    }
  }

  get isPartial(): boolean {
    return typeof this.username !== "undefined";
  }
}
