import { UserManager } from "../managers/UserManager.ts";
import { WebSocketHandler } from "../network/WebSocketHandler.ts";
import { Events } from "./Events.ts";

export interface ClientOptions {
  token: string;
}

export class Client {
  public readonly token: string;
  public readonly users = new UserManager(this);
  public readonly ws = new WebSocketHandler(this);
  public readonly events = new Events();

  constructor(public options: ClientOptions) {
    if (!options?.token) {
      throw new Error("Client cannot be instanciated without a token");
    }

    options.token = `Bot ${options.token}`;

    this.token = options.token;
  }

  async connect() {
    await this.ws.handleConnecting();
  }
}
