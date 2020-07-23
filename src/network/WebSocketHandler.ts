import { Client, ClientOptions } from "../client/Client.ts";
import {
  WebSocket,
  connectWebSocket,
  isWebSocketCloseEvent,
} from "../../deps.ts";
import { GATEWAY_BASE_URL, GATEWAY_VERSION } from "../util/Constants.ts";
import { EventHandler } from "./EventHandler.ts";

const { stringify, parse } = JSON;

export interface Payload {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export class WebSocketHandler {
  public socket!: WebSocket;
  public eventHandler = new EventHandler(this, this.client);

  public heartbeatInterval!: number;

  public sequence?: number | null;
  public sessionID!: number;
  public receivedAck = true;

  constructor(public client: Client) {}

  public async handleConnecting() {
    this.socket = await connectWebSocket(
      `${GATEWAY_BASE_URL}/?v=${GATEWAY_VERSION}&encoding=json`,
    );

    for await (const payload of this.socket) {
      if (isWebSocketCloseEvent(payload)) {
        console.log(payload);
        return;
      } else if (typeof payload === "string") {
        await this.handlePayload(parse(payload) as Payload);
      }
    }
  }

  private async handlePayload(payload: Payload) {
    console.log(payload);

    this.sequence = payload.s || null;

    switch (payload.op) {
      case 0:
        this.eventHandler.handle(
          { data: payload.d, name: payload.t as string },
        );
        break;
      case 10:
        // await this.singleHeartbeat();
        this.handleHeartbeat(payload.d.heartbeat_interval);
        await this.handleIdentify();
        break;
      case 11:
        this.receivedAck = true;
        break;
    }
  }

  private async singleHeartbeat() {
    if (this.receivedAck) {
      await this.socket.send(stringify({
        op: 1,
        d: this.sequence,
      }));
    } else {
      // TODO : attempt reconnecting
    }
    this.receivedAck = false;
  }

  private handleHeartbeat(delay: number) {
    this.heartbeatInterval = setInterval(() => {
      this.singleHeartbeat();
    }, delay);
  }

  private async handleIdentify() {
    await this.socket.send(stringify({
      op: 2,
      d: {
        token: this.client.token,
        properties: {
          "$os": "linux",
          "$browser": "meow",
          "$device": "meow",
        },
        large_threshold: 250,
      },
    }));
  }
}
