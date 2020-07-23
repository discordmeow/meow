import { Evt } from "../../deps.ts";
import { GatewayError } from "../errors/GatewayError.ts";
import { Guild } from "../models/Guild.ts";

export class ClientEvents {
  public readonly ready = new Evt<void>();
  public readonly gatewayError = new Evt<GatewayError>();
  public readonly guildCreate = new Evt<Guild>();
  public readonly guildAvailable = new Evt<Guild>();
  public readonly guildUnavailable = new Evt<Guild>();
}
