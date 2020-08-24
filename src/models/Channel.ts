import { Client } from "../client/Client.ts";
import { Resolver } from "../util/Resolver.ts";
import { User } from "./User.ts";
import { Guild } from "./Guild.ts";
import {
  RawChannel,
  RawOverwrite,
} from "../util/RawStructures.ts";

export type ChannelType =
  | "GUILD_TEXT"
  | "DM"
  | "GUILD_VOICE"
  | "GROUP_DM"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE";

export interface Overwrite {
  id: string;
  type: RawOverwrite["type"];
  allow: RawOverwrite["allow_new"];
  deny: RawOverwrite["deny_new"];
}

export class BaseChannel {
  public readonly id!: string;
  public type!: ChannelType;
}

export class Channel implements BaseChannel {
  /** the id of this channel */
  public readonly id: string;
  /** the type of channel */
  public type: ChannelType;
  /** the id of the guild */
  public guildID?: string;
  /** sorting position of the channel */
  public position?: number;
  /** explicit permission overwrites for members and roles */
  public permissionOverwrites?: Overwrite[];
  /** the name of the channel (2-100 characters) */
  public name?: string;
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

  private _toString =
    (["GUILD_NEWS", "GUILD_STORE", "GUILD_TEXT"] as ChannelType[])
        .includes(this.type)
      ? `<#${this.id}>`
      : this.id;

  constructor(structure: RawChannel, public client: Client) {
    this.id = structure.id;
    this.type = Resolver.toStringChannelType(structure.type);
    this.guildID = structure.guild_id || undefined;
    this.position = structure.position || undefined;
    if (structure.permission_overwrites) {
      this.permissionOverwrites = structure.permission_overwrites.map((
        { id, type, allow_new, deny_new },
      ) => ({ id, type, allow: allow_new, deny: deny_new }));
    }
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
      structure.recipients.forEach((recipient): void => {
        (this.recipients as User[]).push(client.cache.addUser(recipient));
      });
    }
    this.icon = structure.icon || undefined;
    this.ownerID = structure.owner_id || undefined;
    this.applicationID = structure.application_id || undefined;
    this.parentID = structure.parent_id || undefined;
    this.lastPinTimestamp = structure.last_pin_timestamp || undefined;
  }

  get isPartial(): boolean {
    return typeof this.lastMessageID === "undefined";
  }

  public guild(): Guild | undefined {
    if (!this.guildID) {
      return;
    }

    return this.client.cache.guilds.get(this.guildID);
  }

  public toString() {
    return this._toString;
  }
}
