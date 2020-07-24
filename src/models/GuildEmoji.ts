import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { Role } from "./Role.ts";
import { User } from "./User.ts";
import { RawEmoji } from "../network/event_handling/RawStructures.ts";

export class GuildEmoji {
  /** Emoji ID */
  public readonly id: string;
  /** Emoji name */
  public name!: string;
  /** User that created this emoji */
  public user!: User | null;
  /** Whether this emoji is managed */
  public managed!: boolean;
  /** Whether this emoji is animated */
  public animated!: boolean;
  /** Whether this emoji can be used, may be false due to loss of Server Boosts */
  public available!: boolean;
  /** Roles this emoji is whitelist to */
  public roles: Map<string, Role> = new Map<string, Role>();
  /** Whether this emoji must be wrapped in colons */
  public requireColons!: boolean;

  constructor(structure: RawEmoji, public guild: Guild, public client: Client) {
    this.id = structure.id as string;
    if (structure.user) this.user = client.cache.addUser(structure.user);

    client.cache.patchEmoji(this, structure);
  }
}
