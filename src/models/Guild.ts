import { Client } from "../client/Client.ts";
import { Channel } from "./Channel.ts";
import { GuildEmoji } from "./GuildEmoji.ts";
import { GuildMember } from "./GuildMember.ts";
import { Role } from "./Role.ts";
import { VoiceState } from "./VoiceState.ts";
import {
  RawGuildFeatures,
  RawGuild,
  RawMFALevel,
} from "../network/event_handling/RawStructures.ts";
import { Presence } from "./Presence.ts";

export type GuildFeatures = RawGuildFeatures;
export type MFALevel = RawMFALevel;

export class Guild {
  /** guild id */
  public readonly id: string;
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  public name!: string;
  /** icon hash */
  public icon?: string;
  /** splash hash */
  public splash?: string;
  /** discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
  public discoverySplash?: string;
  /** true if the bot is the owner of the guild */
  public owner!: boolean | null;
  /** id of owner */
  public ownerID!: string;
  /** total permissions for the bot in the guild (excludes overrides) */
  public permissions!: number | null;
  /** voice region id for the guild */
  public region!: string;
  /** voice region id for the guild */
  public afkChannelID?: string;
  /**	afk timeout in seconds */
  public afkTimeout!: number;
  // embed_enabled and embed_channel_id are deprecated, see widget_channel_id and widget_enabled
  /** verification level required for the guild */
  public verificationLevel!: number;
  /** default message notifications level */
  public defaultMessageNotifications!: number;
  /** default message notifications level */
  public explicitContentFilter!: number;
  /** roles in the guild */
  public roles = new Map<string, Role>();
  /** custom guild emojis */
  public emojis = new Map<string, GuildEmoji>();
  /** enabled guild features */
  public features!: GuildFeatures[];
  /** required MFA level for the guild */
  public mfaLevel!: MFALevel;
  /** application id of the guild creator if it is bot-created */
  public applicationID?: string;
  /** true if the server widget is enabled */
  public widgetEnable!: boolean | null;
  /** the channel id that the widget will generate an invite to, or null if set to no invite */
  public widgetChannelID?: string | null;
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  public systemChannelID?: string;
  /** system channel flags */
  public systemChannelFlags!: number;
  /** the id of the channel where guilds with the "PUBLIC" feature can display rules and/or guidelines */
  public rulesChannelID?: string;
  /** when this guild was joined at */
  public joinedAt!: number;
  /** true if this is considered a large guild */
  public large!: boolean;
  /** true if this guild is unavailable due to an outage */
  public unavailable!: boolean;
  /** total number of members in this guild */
  public memberCount!: number;
  /** states of members currently in voice channels */
  public voiceStates: VoiceState[] = [];
  /** users in the guild */
  public members = new Map<string, GuildMember>();
  /** channels in the guild */
  public channels = new Map<string, Channel>();
  /** presences of the members in the guild, will only include non-offline members if the size is greater than large threshold */
  public presences = new Map<string, Presence>();

  constructor(structure: RawGuild, public client: Client) {
    this.id = structure.id;

    client.cache.patchGuild(this, structure);
  }
}
