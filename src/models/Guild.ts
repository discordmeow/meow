import { Client } from "../client/Client.ts";
import { Emoji } from "./Emoji.ts";
import { Role } from "./Role.ts";

export class Guild {
  /** Guild ID */
  public readonly id: string;
  /** Guild name */
  public name: string;
  /** Voice region ID for the guild */
  public region: string;
  /** `true` if this guild is unavailable due to an outage */
  public unavailable: boolean;
  /** ID of the owner */
  public ownerID: string;
  /** Roles in the guild */
  public roles: Map<string, Role> = new Map<string, Role>();
  /** Custom guild emojis */
  public emojis: Map<string, Emoji> = new Map<string, Emoji>();
  /** Icon hash */
  public iconHash: string;

  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.name = structure.name;
    this.region = structure.region;
    this.unavailable = structure.unavailable;
    this.ownerID = structure.owner_id;
    this.iconHash = structure.icon;

    if (structure.roles) {
      structure.roles
        .map((role: any): void => {
          this.roles.set(role.id, new Role(role, this, client));
        });
    }

    if (structure.emojis) {
      structure.emojis.map((emoji: any): void => {
        this.emojis.set(emoji.id, new Emoji(emoji, this, client));
      });
    }
  }
}
