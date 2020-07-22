import { Client } from '../client/Client.ts';

export class User {
  public readonly id: string;
  public username?: string;
  public discriminator?: string;
  public avatarHash?: string;
  public bot?: boolean;
  public system?: boolean;
  public mfaEnabled?: boolean;
  public locale?: string;
  // readonly flags?: number;
  public premiumType?: number;
  public publicFlags?: number;

  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.username = structure.username;

    if (!this.isPartial) {
      this.discriminator = structure.discriminator;
      this.avatarHash = structure.avatar;
      this.bot = structure.bot;
      this.system = structure.system;
      this.mfaEnabled = structure.mfa_enabled;
      this.locale = structure.locale;
      // this.flags = structure.flags;
      this.premiumType = structure.premium_type;
      this.publicFlags = structure.public_flags;
    }
  }

  get isPartial(): boolean {
    return typeof this.username !== 'undefined';
  }
}
