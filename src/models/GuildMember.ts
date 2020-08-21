import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { User } from "./User.ts";
import { RawGuildMember } from "../network/event_handling/RawStructures.ts";
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
    if (structure.user) this.user = client.cache.addUser(structure.user);
    this.joinedAt = structure.joined_at;

    this.guildID = guild.id;

    client.cache.patchMember(this, structure);
  }

  get guild(): Guild {
    return this.client.cache.guilds.get(this.guildID) as Guild;
  }
}
