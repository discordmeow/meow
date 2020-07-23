import { Evt } from "../../deps.ts";
import { GatewayError } from "../errors/GatewayError.ts";

export class ClientEvents {
  public readonly ready = new Evt<void>();
  public readonly gatewayError = new Evt<GatewayError>();
}
