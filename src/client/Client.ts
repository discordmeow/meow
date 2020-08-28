import { Cache } from "./Cache.ts";
import { WebSocketHandler } from "../network/WebSocketHandler.ts";
import { ClientEvents } from "./ClientEvents.ts";
import { User } from "../models/User.ts";
import { USER_AVATAR, USER_DEFAULT_AVATAR } from "../util/endpoints/CDN.ts";

export type AllowedFormats = "webp" | "gif" | "png" | "jpg" | "jpeg";
export type AllowedSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface ClientOptions {
  token: string;
}

export class Client {
  public readonly token: string;
  public readonly ws = new WebSocketHandler(this);
  public readonly events = new ClientEvents();
  public cache = new Cache(this);

  constructor(public options: ClientOptions) {
    if (!options?.token) {
      throw new Error("Client cannot be instantiated without a token");
    }

    options.token = `Bot ${options.token}`;

    this.token = options.token;
  }

  public async connect() {
    await this.ws.connect();
  }

  public getAvatarURL(user: User, options: {
    format?: AllowedFormats;
    size?: AllowedSizes;
    dynamic?: boolean;
  } = {
    format: "webp",
    size: 256,
    dynamic: false,
  }): string {
    if (user.isPartial) throw new Error("User should not be partial.");

    return USER_AVATAR(
      {
        userID: user.id,
        avatarHash: user.avatar as string,
        format: options.format,
        size: options.size,
        dynamic: options.dynamic,
      },
    );
  }

  public getDefaultAvatarURL(user: User, size: AllowedSizes): string {
    if (user.isPartial) throw new Error("User should not be partial.");
    return USER_DEFAULT_AVATAR(user.discriminator as string);
  }
}
