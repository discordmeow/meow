export interface RawUser {
  /** the user's id */
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

export interface RawUnavailableGuild {
  /** guild id */
  id: string;
  /** true if this guild is unavailable due to an outage */
  unavailable: true;
}

export interface RawReadyStructure {
  /** gateway version */
  v: number;
  /** information about the user including email */
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
