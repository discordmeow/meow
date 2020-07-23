import { Client } from "../client/Client.ts";
import { Channel } from "./Channel.ts";
import { Emoji } from "./Emoji.ts";
import { GuildMember } from "./GuildMember.ts";
import { Role } from "./Role.ts";
import { VoiceState } from "./VoiceState.ts";

export type GuildFeatures =
  | "INVITE_SPLASH"
  | "VIP_REGIONS"
  | "VANITY_URL"
  | "VERIFIED"
  | "PARTNERED"
  | "PUBLIC"
  | "COMMERCE"
  | "NEWS"
  | "DISCOVERABLE"
  | "FEATURABLE"
  | "ANIMATED_ICON"
  | "BANNER"
  | "PUBLIC_DISABLED"
  | "WELCOME_SCREEN_ENABLED";

export class Guild {
  /** guild id */
  public readonly id: string;
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  public name: string;
  /** icon hash */
  public icon?: string;
  /** splash hash */
  public splash?: string;
  /** discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
  public discoverySplash?: string;
  /** true if the user is the owner of the guild */
  public owner: boolean | null;
  /** id of owner */
  public ownerID: string;
  /** total permissions for the user in the guild (excludes overrides) */
  public permissions: number | null;
  /** voice region id for the guild */
  public region: string;
  /** voice region id for the guild */
  public afkChannelID?: string;
  /**	afk timeout in seconds */
  public afkTimeout: number;
  // embed_enabled and embed_channel_id are deprecated, see widget_channel_id and widget_enabled
  /** verification level required for the guild */
  public verificationLevel: number;
  /** default message notifications level */
  public defaultMessageNotifications: number;
  /** default message notifications level */
  public explicitContentFilter: number;
  /** roles in the guild */
  public roles: Map<string, Role> = new Map<string, Role>();
  /** custom guild emojis */
  public emojis: Map<string, Emoji> = new Map<string, Emoji>();
  /** enabled guild features */
  public features: GuildFeatures[];
  /** required MFA level for the guild */
  public mfaLevel: number;
  /** application id of the guild creator if it is bot-created */
  public applicationID?: string;
  /** true if the server widget is enabled */
  public widgetEnable: boolean | null;
  /** the channel id that the widget will generate an invite to, or null if set to no invite */
  public widgetChannelID?: string | null;
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  public systemChannelID?: string;
  /** system channel flags */
  public systemChannelFlags: number;
  /** the id of the channel where guilds with the "PUBLIC" feature can display rules and/or guidelines */
  public rulesChannelID?: string;
  /** when this guild was joined at */
  public joinedAt: number;
  /** true if this is considered a large guild */
  public large: boolean;
  /** true if this guild is unavailable due to an outage */
  public unavailable: boolean;
  /** total number of members in this guild */
  public memberCount: number;
  /** states of members currently in voice channels */
  public voiceStates: VoiceState[] = [];
  /** users in the guild */
  public members: Map<string, GuildMember> = new Map<string, GuildMember>();
  /** channels in the guild */
  public channels: Map<string, Channel> = new Map<string, Channel>();

  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.name = structure.name;
    this.icon = structure.icon;
    this.splash = structure.splash;
    this.discoverySplash = structure.discovery_splash;
    this.owner = structure.owner || null;
    this.ownerID = structure.owner_id;
    this.permissions = structure.permissions || null;
    this.region = structure.region;
    this.afkChannelID = structure.afk_channel_id;
    this.afkTimeout = structure.afk_timeout;
    this.verificationLevel = structure.verification_level;
    this.defaultMessageNotifications = structure.default_message_notifications;
    this.explicitContentFilter = structure.explicit_content_filter;
    structure.roles.map((role: any): void => {
      this.roles.set(role.id, new Role(role, this, client));
    });
    structure.emojis.map((emoji: any): void => {
      this.emojis.set(emoji.id, client.cache.cacheEmoji(emoji, this));
    });
    this.features = structure.features;
    this.mfaLevel = structure.mfa_level;
    this.applicationID = structure.application_id;
    this.widgetEnable = structure.widget_enable || null;
    this.widgetChannelID = structure.widget_channel_id;
    this.systemChannelID = structure.system_channel_id;
    this.systemChannelFlags = structure.system_channel_flags;
    this.rulesChannelID = structure.rules_channel_id;
    this.joinedAt = structure.joined_at;
    this.large = structure.large;
    this.unavailable = structure.unavailable;
    this.memberCount = this.members.size;
    if (structure.voice_states) {
      structure.voice_states.map((voiceState: any): void => {
        this.voiceStates.push(new VoiceState(voiceState, this, client));
      });
    }
    if (structure.members) {
      structure.members.map((member: any): void => {
        this.members.set(member.user.id, new GuildMember(member, this, client));
      });
    }
    if (structure.channels) {
      structure.channels.map((channel: any): void => {
        this.channels.set(channel.id, client.cache.cacheChannel(channel));
      });
    }
  }
}

// todo(n1c00o): End of the structure
// ! Please don't touch to this file
