export interface RawUser {
  id: string;
  /** the user's username, not unique across the platform */
  username: string;
  /** the user's 4-digit discord-tag */
  discriminator: string;
  /** the user's avatar hash */
  avatar?: string;
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean;
  /** whether the user is an Official Discord System user (part of the urgent message system) */
  system?: boolean;
  /** whether the user has two factor enabled on their account */
  mfa_enabled?: boolean;
  /** the user's chosen language option */
  locale?: string;
  /** the flags on a user's account */
  flags?: number;
  /** the type of Nitro subscription on a user's account */
  premium_type?: number;
  /** the public flags on a user's account */
  public_flags?: number;
}

export interface RawGuildMember {
  /** The field user won't be included in the member object attached to MESSAGE_CREATE and MESSAGE_UPDATE gateway events. */
  user?: RawUser;
  nick?: string;
  roles: RawRole["id"][];
  joined_at: number;
  premium_since?: number;
  deaf: boolean;
  mute: boolean;
}

export interface RawRole {
  id: string;
  name: string;
  color: number;
  /** if this role is pinned in the user listing */
  hoist: boolean;
  position: number;
  permissions: number;
  /** whether this role is managed by an integration */
  managed: boolean;
}

export interface RawEmoji {
  id?: string;
  /** can be null only in reaction emoji objects */
  name?: string;
  roles?: RawRole["id"][];
  user?: RawUser;
  /** whether this emoji must be wrapped in colons */
  require_colons?: boolean;
  managed?: boolean;
  animated?: boolean;
  /** whether this emoji can be used, may be false due to loss of Server Boosts */
  available?: boolean;
}

export interface RawVoiceState {
  guild_id?: string;
  channel_id?: string;
  user_id: string;
  member?: RawGuildMember;
  session_id: string;
  deaf: boolean;
  mute: boolean;
  self_dead: boolean;
  self_mute: boolean;
  self_stream?: boolean;
  self_video: boolean;
  suppress: boolean;
}

export interface RawChannel {
  id: string;
  type: RawChannelTypes;
  guild_id?: string;
  position?: number;
  permission_overwrites?: RawOverwrite[];
  name?: string;
  topic?: string;
  last_message_id?: string;
  bitrate?: number;
  user_limit?: number;
  rate_limit_per_user?: number;
  /** the recipients of the DM */
  recipients?: RawUser[];
  /** icon hash */
  icon?: string;
  /** id of the DM creator */
  owner_id?: string;
  /** application id of the group DM creator if it is bot-created */
  application_id?: string;
  parent_id?: string;
  last_pin_timestamp?: number;
}

export interface RawOverwrite {
  id: string;
  type: "role" | "member";
  allow: number;
  deny: number;
}

export interface RawClientStatus {
  desktop?: string;
  mobile?: string;
  web?: string;
}

export interface RawActivityEmoji {
  name: string;
  id?: string;
  animated?: boolean;
}

export interface RawActivity {
  name: string;
  type: RawActivityTypes;
  url?: string;
  created_at: number;
  timestamps: RawActivityTimestamps;
  application_id?: string;
  details?: string;
  state?: string;
  emoji?: RawActivityEmoji;
  party?: RawActivityParty;
  assets?: RawActivityAssets;
  secrets?: RawActivitySecrets;
  instance?: boolean;
  flags?: number;
}

export interface RawActivityParty {
  id?: string;
  /** array of two integers (current_size, max_size) - used to show the party's current and maximum size */
  size?: [number, number];
}

export interface RawActivityAssets {
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

export interface RawActivitySecrets {
  join?: string;
  spectate?: string;
  match?: string;
}

export interface RawActivityTimestamps {
  stard?: number;
  end?: number;
}

export enum RawActivityFlags {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  SPECTATE = 1 << 2,
  JOIN_REQUEST = 1 << 3,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
}

export enum RawActivityTypes {
  Game,
  Streaming,
  Listening,
  Custom,
}

export enum RawChannelTypes {
  GUILD_TEXT,
  DM,
  GUILD_VOICE,
  GROUP_DM,
  GUILD_CATEGORY,
  GUILD_NEWS,
  GUILD_STORE,
}

export enum RawVerificationLevel {
  /** unrestricted */
  NONE,
  /** must have verified email on account */
  LOW,
  /** must be registered on Discord for longer than 5 minutes */

  MEDIUM,
  /** (╯°□°）╯︵ ┻━┻ - must be a member of the server for longer than 10 minutes */
  HIGH,
  /** ┻━┻ ミヽ(ಠ 益 ಠ)ﾉ彡 ┻━┻ - must have a verified phone number */
  VERY_HIGH,
}

export enum RawMessageNotificationLevel {
  ALL_MESSAGES,
  ONLY_MENTIONS,
}

export enum RawExplicitContentFilterLevel {
  DISABLED,
  MEMBERS_WITHOUT_ROLES,
  ALL_MEMBERS,
}

export enum RawMFALevel {
  NONE,
  ELEVATED,
}

export enum RawPremiumTier {
  NONE,
  TIER_1,
  TIER_2,
  TIER_3,
}

export enum RawSystemChannelFlags {
  /** Suppress member join notifications */
  SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
  /** Suppress server boost notifications */
  SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
}

export type RawGuildFeatures =
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

export type RawActivityStatus = "idle" | "dnd" | "online" | "offline";

export interface RawUnavailableGuild {
  id: string;
  /** true if this guild is unavailable due to an outage */
  unavailable: true;
}

export interface RawGuild {
  id: string;
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  name: string;
  /** icon hash */
  icon?: string;
  /** splash hash */
  splash?: string;
  /** discovery splash hash; only present for guilds with the "DISCOVERABLE" feature */
  discovery_splash?: string;
  /** true if the user is the owner of the guild */
  owner?: boolean;
  owner_id: string;
  /** total permissions for the user in the guild (excludes overrides) */
  permissions?: number;
  /** voice region id for the guild */
  region: string;
  afk_channel_id?: string;
  /** afk timeout in seconds */
  afk_timeout: number;
  /** verification level required for the guild */
  verification_level: RawVerificationLevel;
  /** default message notifications level */
  default_message_notifications: RawMessageNotificationLevel;
  /** explicit content filter level */
  explicit_content_filter: RawExplicitContentFilterLevel;
  roles: RawRole[];
  emojis: RawEmoji[];
  features: RawGuildFeatures[];
  mfa_level: RawMFALevel;
  application_id?: string;
  /** the channel id that the widget will generate an invite to, or null if set to no invite */
  widget_channel_id?: string;
  /** the id of the channel where guild notices such as welcome messages and boost events are posted */
  system_channel_id?: string;
  system_channel_flags: number;
  rules_channel_id?: string;
  joined_at?: number;
  large?: boolean;
  unavailable?: boolean;
  member_count?: number;
  voice_states?: RawVoiceState[];
  members?: RawGuildMember[];
  channels?: RawChannel[];
  presences?: RawPresenceUpdate[];
  max_presences?: number;
  max_members?: number;
  vanity_url_code?: string;
  description?: string;
  /** banner hash */
  banner?: string;
  premium_tier: RawPremiumTier;
  premium_subscription_count?: number;
  preferred_locale: string;
  public_updates_channel_id?: string;
  max_video_channel_users?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface RawPresenceUpdate {
  user: RawUser;
  roles: RawRole["id"][];
  game?: RawActivity;
  guild_id: string;
  status: RawActivityStatus;
  activities: RawActivity[];
  client_status: RawClientStatus;
  premium_since?: number;
  nick?: string;
}

export interface RawReady {
  /** gateway version */
  v: number;
  user: RawUser;
  /** empty array */
  private_channels: [];
  /** the guilds the user is in */
  guilds: RawUnavailableGuild[];
  /** used for resuming connections */
  session_id: string;
  /** the shard information associated with this session, if sent when identifying */
  shard?: [number, number];
}

export interface RawChannelPinsUpdate {
  /** the id of the guild */
  guild_id?: string;
  /** the id of the channel */
  channel_id: string;
  /** the time at which the most recent pinned message was pinned */
  last_pin_timestamp?: number;
}
