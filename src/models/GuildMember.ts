import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { User } from "./User.ts";
import { RawGuildMember } from "../util/RawStructures.ts";
import { Role } from "./Role.ts";

export class GuildMember {
  /** the ID of the member's guild */
  public guildID: string;
  /** the user this guild member represents */
  public user!: User;
  /** this users guild nickname */
  public nick?: string;
  /** roles id of this guild member */
  public roles = new Map<string, Role>();
  /** when the user joined the guild */
  public joinedAt: number;
  /** when the user started boosting the guild */
  public premiumSince?: number | null;
  /** whether the user is deafened in voice channels */
  public deaf!: boolean;
  /** whether the user is deafened in voice channels */
  public mute!: boolean;

  constructor(
    structure: RawGuildMember,
    guild: Guild,
    public client: Client,
  ) {
    this.guildID = guild.id;
    this.joinedAt = structure.joined_at;

    if (structure.user) this.user = client.cache.addUser(structure.user);

    client.cache.patchMember(this, structure);
  }

  public guild(): Guild {
    return this.client.cache.guilds.get(this.guildID) as Guild;
  }
}
