import { WebSocketHandler } from "./WebSocketHandler.ts";
import { Client } from "../client/Client.ts";

export interface EventData {
  name: string;
  data: any;
}

export class EventHandler {
  constructor(public ws: WebSocketHandler, public client: Client) {}

  public handle(event: EventData) {
    switch (event.name) {
      case "READY":
        this.ws.sessionID = event.data.session_id;
        this.client.events.ready.post();
        break;
    }
  }
}
