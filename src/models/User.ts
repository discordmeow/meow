import { Client } from "../client/Client.ts";

export class User {
  /** The user's ID */
  public readonly id: string;
  /** The user's username, not unique across the platform */
  public username?: string;
  /** The user's 4-digit discord-tag */
  public discriminator?: string;
  /** The user's avatar hash */
  public avatar?: string;
  /** Whether the user belongs to an OAuth2 application */
  public bot?: boolean;
  /** Whether the user is an Official Discord System user (part of the urgent message system) */
  public system?: boolean;
  /** Whether the user has two factor enabled on their account */
  public mfaEnabled?: boolean;
  /** The user's chosen language option */
  public locale?: string;
  /** The type of Nitro subscription on a user's account */
  public premiumType?: number;
  /** The public flags on a user's account */
  public publicFlags?: number;

  constructor(structure: any, public client: Client) {
    this.id = structure.id;

    client.cache.patchUser(this, structure);
  }

  get isPartial(): boolean {
    return typeof this.username !== "undefined";
  }
}
