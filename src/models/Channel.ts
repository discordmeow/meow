import { Client } from "../client/Client.ts";
import { Resolver } from "../util/Resolver.ts";
import { User } from "./User.ts";
import { Guild } from "./Guild.ts";

export type ChannelTypes =
  | "GUILD_TEXT"
  | "DM"
  | "GUILD_VOICE"
  | "GROUP_DM"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE";

export interface Overwrite {
  id: string;
  type: "role" | "member";
  allow: number;
  deny: number;
}

export class Channel {
  /** the id of this channel */
  public readonly id: string;
  /** the type of channel */
  public type: ChannelTypes;
  /** the id of the guild */
  public guildID?: string;
  /** sorting position of the channel */
  public position?: number;
  /** explicit permission overwrites for members and roles */
  public permissionOverwrites?: Overwrite[];
  /** the name of the channel (2-100 characters) */
  public name: string;
  /** the channel topic (0-1024 characters) */
  public topic?: string;
  /** whether the channel is nsfw */
  public nsfw?: boolean;
  /** the id of the last message sent in this channel (may not point to an existing or valid message) */
  public lastMessageID?: string;
  /** the bitrate (in bits) of the voice channel */
  public bitrate?: number;
  /** the user limit of the voice channel */
  public userLimit?: number;
  /** amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected */
  public rateLimitPerUser?: number;
  /** the recipients of the DM */
  public recipients?: User[];
  /** icon hash */
  public icon?: string;
  /** id of the DM creator */
  public ownerID?: string;
  /** application id of the group DM creator if it is bot-created */
  public applicationID?: string;
  /** id of the parent category for a channel (each parent category can contain up to 50 channels) */
  public parentID?: string;
  /** when the last pinned message was pinned */
  public lastPinTimestamp?: number;
  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.type = Resolver.toHumanReadableChannelType(structure.type);
    this.guildID = structure.guild_id || undefined;
    this.position = structure.position || undefined;
    this.permissionOverwrites = structure.permission_overwrites || undefined;
    this.name = structure.name;
    this.topic = structure.topic || undefined;
    this.nsfw = structure.nsfw || undefined;
    this.lastMessageID = structure.last_message_id || undefined;
    this.bitrate = structure.bitrate || undefined;
    this.userLimit = structure.user_limit || undefined;
    this.rateLimitPerUser = structure.rate_limit_per_user || undefined;
    this.recipients = undefined;
    if (structure.recipients) {
      this.recipients = [];
      structure.recipients.map((recipient: any): void => {
        this.recipients?.push(client.cache.addUser(recipient));
      });
    }
    this.icon = structure.icon || undefined;
    this.ownerID = structure.ownerID || undefined;
    this.applicationID = structure.application_id || undefined;
    this.parentID = structure.parent_id || undefined;
    this.lastPinTimestamp = structure.last_pin_timestamp || undefined;
  }

  get isPartial(): boolean {
    return typeof this.lastMessageID === "undefined";
  }

  get guild(): Guild | undefined {
    if (!this.guildID) {
      return;
    }

    return this.client.cache.guilds.get(this.guildID) as Guild;
  }
}
