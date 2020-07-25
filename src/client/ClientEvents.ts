import { Evt } from "../../deps.ts";
import { GatewayError } from "../errors/GatewayError.ts";
import { Channel } from "../models/Channel.ts";
import { Guild } from "../models/Guild.ts";
import { GuildEmoji } from "../models/GuildEmoji.ts";
import { User } from "../models/User.ts";

export class ClientEvents {
  /** Emitted when the client is ready */
  public readonly ready = new Evt<void>();

  /** no description provided */
  public readonly gatewayError = new Evt<GatewayError>();

  /** Emitted when the client join a Guild. */
  public readonly guildCreate = new Evt<Guild>();
  /** Emitted when a Guild become available. */
  public readonly guildAvailable = new Evt<Guild>();
  /** Emitted when a Guild become unavailable. */
  public readonly guildUnavailable = new Evt<Guild>();
  /** Emitted when a Guild is updated. */
  public readonly guildUpdate = new Evt<Guild>();
  /** Emitted when the client leave a Guild. */
  public readonly guildDelete = new Evt<Guild>();
  /** Emitted when a User is banned from a Guild. */
  public readonly guildBanAdd = new Evt<{ guild: Guild; user: User }>();
  /** Emitted when a User is unbanned from a Guild */
  public readonly guildBanRemove = new Evt<{ guild: Guild; user: User }>();
  /** Emitted when a Guild's emojis have been updated */
  public readonly guildEmojisUpdate = new Evt<
    { guild: Guild; emojis: GuildEmoji[] }
  >();

  /** Emitted when a Channel is created. */
  public readonly channelCreate = new Evt<Channel>();
  /** Emitted when a Channel is updated. */
  public readonly channelUpdate = new Evt<Channel>();
  /** Emitted when a Channel is deleted. */
  public readonly channelDelete = new Evt<Channel>();
  /** Emitted when a Channel pins are modified. */
  public readonly channelPinsUpdate = new Evt<
    { channel: Channel; guild?: Guild; lastPinTimestamp?: number }
  >();
}
