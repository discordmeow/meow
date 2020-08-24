import {
  RawActivity,
  RawActivityTypes,
  RawActivityTimestamps,
  RawActivityParty,
  RawActivitySecrets,
  RawActivityFlags,
} from "../util/RawStructures.ts";
import { Client } from "../client/Client.ts";
import { GuildEmoji } from "./GuildEmoji.ts";
import { ActivityAssets } from "./ActivityAssets.ts";

export type ActivityTypes = RawActivityTypes;
export type ActivityTimestamps = RawActivityTimestamps;
export type ActivityParty = RawActivityParty;
export type ActivitySecrets = RawActivitySecrets;
export type ActivityFlags = RawActivityFlags;

export class Activity {
  /** the activity's name */
  public name!: string;
  /** activity type */
  public type!: ActivityTypes;
  /** stream url, is validated when type is 1 */
  public url?: string;
  /** unix timestamp of when the activity was added to the user's session */
  public createdAt!: number;
  /** unix timestamps for start and/or end of the game */
  public timestamps?: ActivityTimestamps;
  /** application id for the game */
  public applicationID?: string;
  /** what the player is currently doing */
  public details?: string;
  /** the user's current party status */
  public state?: string;
  /** the emoji used for a custom status */
  public emoji?: GuildEmoji;
  /** information for the current party of the player */
  public party?: ActivityParty;
  /** images for the presence and their hover texts */
  public assets?: ActivityAssets;
  /** secrets for Rich Presence joining and spectating */
  public secrets?: ActivitySecrets;
  /** whether or not the activity is an instanced game session */
  public instance?: boolean;
  /** activity flags */
  public flags?: ActivityFlags;

  constructor(structure: RawActivity, public client: Client) {
    client.cache.patchActivity(this, structure);
  }
}
