import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { Role } from "./Role.ts";
import { User } from "./User.ts";

export class Emoji {
  /** Emoji ID */
  public readonly id: string;
  /** Emoji name */
  public name: string;
  /** User that created this emoji */
  public user!: User | null;
  /** Whether this emoji is managed */
  public managed: boolean;
  /** Whether this emoji is animated */
  public animated: boolean;
  /** Whether this emoji can be used, may be false due to loss of Server Boosts */
  public available: boolean;
  /** Roles this emoji is whitelist to */
  public roles: Map<string, Role> = new Map<string, Role>();
  /** Whether this emoji must be wrapped in colons */
  public requireColons: boolean;

  constructor(structure: any, public guild: Guild, public client: Client) {
    this.id = structure.id;
    this.name = structure.name;
    if (structure.user) this.user = client.cache.cacheUser(structure.user);
    this.managed = structure.managed;
    this.animated = structure.animated;
    this.available = structure.available;
    this.requireColons = structure.require_colons;

    if (structure.roles) {
      structure.roles.map((role: any): void => {
        if (guild.roles.has(role.id)) 
          this.roles.set(role.id, <Role>guild.roles.get(role.id));
      });
    } 
    
  }
}
