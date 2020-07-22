import { Client } from "../client/Client.ts";
import {
  WebSocket,
  connectWebSocket,
  isWebSocketCloseEvent,
} from "../../deps.ts";
import { GATEWAY_BASE_URL, GATEWAY_VERSION } from "../util/Constants.ts";

export interface Payload {
  op: number;
  d: {
    [key: string]: any;
  };
  s?: number;
  t?: string;
}

export class WebSocketHandler {
  socket!: WebSocket;
  heartbeatInterval!: number;

  sequence: number | null = null;
  receivedAck = true;

  constructor(public client: Client) {}

  async connect() {
    this.socket = await connectWebSocket(
      `${GATEWAY_BASE_URL}/?v=${GATEWAY_VERSION}&encoding=json`,
    );

    for await (const msg of this.socket) {
      console.log(msg);
      if (isWebSocketCloseEvent(msg)) {
        return;
      } else if (typeof msg === "string") {
        await this.handlePayload(JSON.parse(msg) as Payload);
      }
    }
  }

  async handlePayload(payload: Payload) {
    switch (payload.op) {
      case 10:
        await this.handleHeartbeat(payload.d.heartbeat_interval);
        break;
      case 11:
        this.receivedAck = true;
        break;
    }
  }

  async singleHeartbeat() {
    if (this.receivedAck) {
      await this.socket.send(JSON.stringify({
        op: 1,
        d: this.sequence,
      }));
    } else {
      // TODO : attempt reconnecting
    }
    this.receivedAck = false;
  }

  async handleHeartbeat(delay: number) {
    this.heartbeatInterval = setInterval(() => {
      this.singleHeartbeat();
    }, delay);
  }
}
