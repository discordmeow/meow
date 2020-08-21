import { Client } from "../client/Client.ts";
import {
  WebSocket,
  WebSocketCloseEvent,
  connectWebSocket,
  isWebSocketCloseEvent,
} from "../../deps.ts";
import { GATEWAY_BASE_URL, GATEWAY_VERSION } from "../util/Constants.ts";
import { EventHandler } from "./EventHandler.ts";
import { GatewayError } from "../errors/GatewayError.ts";

const { stringify, parse } = JSON;

export interface Payload {
  op: number;
  d: any;
  s?: number;
  t?: string;
}

export enum Opcodes {
  DISPATCH,
  HEARTBEAT,
  IDENTIFY,
  PRESENCE_UPDATE,
  VOICE_STATE_UPDATE,
  RESUME = 6,
  RECONNECT,
  REQUEST_GUILD_MEMBERS,
  INVALID_SESSION,
  HELLO,
  HEARTBEAT_ACK,
}

export enum CloseEventCodes {
  UNKNOWN_ERROR = 4000,
  UNKNOWN_OPCODE,
  DECODE_ERROR,
  NOT_AUTHENTICATED,
  AUTHENTICATION_FAILED,
  ALREADY_AUTHENTICATED,
  INVALID_SEQ = 4007,
  RATE_LIMITED,
  SESSION_TIMED_OUT,
  INVALID_SHARD,
  SHARDING_REQUIRED,
  INVALID_API_VERSION,
  INVALID_INTENTS,
  DISALLOWED_INTENTS,
}

export class WebSocketHandler {
  public socket!: WebSocket;
  public eventHandler = new EventHandler(this, this.client);

  public heartbeatInterval!: number;

  public sequence?: number | null;
  public sessionID!: string;
  public ackReceived = true;

  public resuming = false;

  public initialUnavailableGuilds = new Set<string>();

  constructor(public client: Client) {}

  public async connect() {
    this.socket = await connectWebSocket(
      `${GATEWAY_BASE_URL}/?v=${GATEWAY_VERSION}&encoding=json`,
    );

    if (this.resuming) {
      this.resuming = false;
      await this.sendResume();
    }

    for await (const payload of this.socket) {
      if (isWebSocketCloseEvent(payload)) {
        await this.handleGatewayError(payload);
      } else if (typeof payload === "string") {
        await this.handlePayload(parse(payload) as Payload);
      }
    }
  }

  private async sendResume() {
    await this.socket.send(stringify({
      op: Opcodes.RESUME,
      d: {
        token: this.client.token,
        session_id: this.sessionID,
        seq: this.sequence,
      },
    }));
  }

  private async handleReconnect() {
    this.resuming = true;

    await this.handleClose();
    await this.connect();
  }

  private async handlePayload(payload: Payload) {
    if (payload.s) this.sequence = payload.s;

    switch (payload.op) {
      case Opcodes.DISPATCH:
        this.eventHandler.handle(
          { data: payload.d, name: payload.t as string },
        );
        break;
      case Opcodes.RECONNECT:
        await this.handleReconnect();
        break;
      case Opcodes.INVALID_SESSION:
        if (!payload.d) {
          await this.handleClose();
        } else {
          await this.handleReconnect();
        }
        break;
      case Opcodes.HELLO:
        this.handleHeartbeat(payload.d.heartbeat_interval);
        await this.sendIdentify();
        break;
      case Opcodes.HEARTBEAT_ACK:
        this.ackReceived = true;
        break;
    }
  }

  private async handleClose() {
    this.ackReceived = true;

    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);

    if (!this.socket.isClosed) await this.socket.close(1000);
  }

  private async sendHeartbeat() {
    if (this.ackReceived) {
      await this.socket.send(stringify({
        op: Opcodes.HEARTBEAT,
        d: this.sequence,
      }));
    } else {
      await this.handleReconnect();
    }
    this.ackReceived = false;
  }

  private handleHeartbeat(delay: number) {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.sendHeartbeat();
      } catch (e) {
        await this.handleReconnect();
      }
    }, delay);
  }

  private async sendIdentify() {
    await this.socket.send(stringify({
      op: Opcodes.IDENTIFY,
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

  private async handleGatewayError({ code, reason }: WebSocketCloseEvent) {
    await this.handleClose();

    switch (code) {
      case CloseEventCodes.UNKNOWN_ERROR:
      case CloseEventCodes.INVALID_SEQ:
      case CloseEventCodes.RATE_LIMITED:
        await this.handleReconnect();
    }

    this.client.events.gatewayError.post(new GatewayError(code, reason));
  }
}
