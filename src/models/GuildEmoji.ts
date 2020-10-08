import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { Role } from "./Role.ts";
import { User } from "./User.ts";
import { RawEmoji } from "../util/RawStructures.ts";
import { BaseStructure } from "./Base.ts";

export class GuildEmoji extends BaseStructure {
  /** The ID of the emoji's guild */
  public guildID: string;
  /** Emoji name */
  public name!: string;
  /** User that created this emoji */
  public user!: User;
  /** Whether this emoji is managed */
  public managed!: boolean;
  /** Whether this emoji is animated */
  public animated!: boolean;
  /** Whether this emoji can be used, may be false due to loss of Server Boosts */
  public available!: boolean;
  /** Roles this emoji is whitelist to */
  public roles = new Map<string, Role>();
  /** Whether this emoji must be wrapped in colons */
  public requireColons!: boolean;
  private _toString: string;

  constructor(structure: RawEmoji, guild: Guild, public client: Client) {
    super(structure.id as string);
    this.guildID = guild.id;

    this._toString = `<${this.animated ? "a" : ""}:${this.name}:${this.id}>`;

    if (structure.user) this.user = client.cache.addUser(structure.user);

    client.cache.patchGuildEmoji(this, structure);
  }

  public guild(): Guild {
    return this.client.cache.guilds.get(this.guildID) as Guild;
  }

  public toString() {
    return this._toString;
  }
}
