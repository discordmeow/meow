import { Evt } from "../../deps.ts";
import { GatewayError } from "../errors/GatewayError.ts";
import { Channel } from "../models/Channel.ts";
import { Guild } from "../models/Guild.ts";
import { RawChannelPinsUpdate } from "../util/RawStructures.ts";

export class ClientEvents {
  /** Emitted when the client is ready */
  public readonly ready = new Evt<void>();

  /** no description provided */
  public readonly gatewayError = new Evt<GatewayError>();

  /** Emitted when the client join a Guild. Send the Guild*/
  public readonly guildCreate = new Evt<Guild>();
  /** Emitted when a Guild become available. Send the Guild */
  public readonly guildAvailable = new Evt<Guild>();
  /** Emitted when a Guild become unavailable. Send the Guild */
  public readonly guildUnavailable = new Evt<Guild>();
  /** Emitted when a Guild is updated. Send the Guild */
  public readonly guildUpdate = new Evt<Guild>();
  /** Emitted when the client leave a Guild. Send the Guild */
  public readonly guildDelete = new Evt<Guild>();

  /** Emitted when a Channel is created. Send the Channel */
  public readonly channelCreate = new Evt<Channel>();
  /** Emitted when a Channel is updated. Send the Channel */
  public readonly channelUpdate = new Evt<Channel>();
  /** Emitted when a Channel is deleted. Send the Channel */
  public readonly channelDelete = new Evt<Channel>();
  /** Emitted when a Channel pins are modified. Send the Channel ID, the Guild ID (if one) and the new last pinned message timestamp (if one) */
  public readonly channelPinsUpdate = new Evt<RawChannelPinsUpdate>();
}
