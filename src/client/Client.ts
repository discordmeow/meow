import { UserManager } from "../managers/UserManager.ts";
import { WebSocketHandler } from "../network/WebSocketHandler.ts";
import * as eventsHandlers from "./Events.ts";

export class Client {
  readonly users = new UserManager(this);
  readonly ws = new WebSocketHandler(this);
  events = eventsHandlers;

  constructor() {}
}
