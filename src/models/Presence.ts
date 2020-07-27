import {
  RawPresenceUpdateEvent,
  RawActivityStatus,
  RawClientStatus,
} from "../network/event_handling/RawStructures.ts";
import { Guild } from "./Guild.ts";
import { Client } from "../client/Client.ts";
import { User } from "./User.ts";
import { Activity } from "./Activity.ts";

export type ActivityStatus = RawActivityStatus;
export type ClientStatus = RawClientStatus;

export class Presence {
  /** the user presence is being updated for */
  public user: User;
  /** roles this user is in */
  public roles!: string[];
  /** the user's current activity */
  public game!: Activity | null;
  /** id of the guild */
  public guildID: string;
  /** either "idle", "dnd", "online", or "offline" */
  public status!: ActivityStatus;
  /** user's current activities */
  public activities!: Activity[];
  /** user's platform-dependent status */
  public clientStatus!: ClientStatus;
  /** when the user started boosting the guild */
  public premiumSince?: number;
  /** this users guild nickname (if one is set) */
  public nick?: string | null;

  constructor(
    structure: RawPresenceUpdateEvent,
    public guild: Guild,
    public client: Client,
  ) {
    this.user = client.cache.addUser(structure.user);
    this.guildID = structure.guild_id;
  }
}
