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
  public readonly id: string;
  public readonly username?: string;
  public readonly discriminator?: string;
  public readonly avatarHash?: string;
  public readonly isBot?: boolean;
  public readonly isSystem?: boolean;
  public readonly hasMFA?: boolean;
  public readonly locale?: string;
  // public readonly flags?: number;
  public readonly premiumType?: number;
  public readonly publicFlags?: number;

  constructor(structure: ReceivedUserStructure) {
    this.id = structure.id;
    this.username = structure.username;
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

  get isPartial(): boolean {
    return typeof this.username !== "undefined";
  }
}
