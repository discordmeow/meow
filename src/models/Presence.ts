import {
  RawPresenceUpdate,
  RawActivityStatus,
  RawClientStatus,
} from "../util/RawStructures.ts";
import { Guild } from "./Guild.ts";
import { Client } from "../client/Client.ts";
import { User } from "./User.ts";
import { Activity } from "./Activity.ts";
import { Role } from "./Role.ts";

export type ActivityStatus = RawActivityStatus;
export type ClientStatus = RawClientStatus;

export class Presence {
  /** id of the user presence is being updated for */
  public userID: string;
  /** IDs of roles this user is in */
  public rolesID: string[] = [];
  /** the user's current activity */
  public game!: Activity | undefined;
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
    structure: RawPresenceUpdate,
    public client: Client,
  ) {
    this.userID = client.cache.addUser(structure.user).id;
    this.guildID = structure.guild_id;
    client.cache.patchPresence(this, structure);
  }

  /** the user presence is being updated for */
  public user(): User {
    return this.client.cache.users.get(this.userID) as User;
  }

  /** the guild */
  public guild(): Guild {
    return this.client.cache.guilds.get(this.guildID) as Guild;
  }

  /** roles this user is in */
  public roles(): Map<string, Role> {
    const returned: Map<string, Role> = new Map();
    this.rolesID.map((ID) =>
      returned.set(ID, this.guild().roles.get(ID) as Role)
    );
    return returned;
  }
}
