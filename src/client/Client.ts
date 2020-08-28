import { Cache } from "./Cache.ts";
import { WebSocketHandler } from "../network/WebSocketHandler.ts";
import { ClientEvents } from "./ClientEvents.ts";
import { User } from "../models/User.ts";
import { USER_AVATAR, USER_DEFAULT_AVATAR } from "../util/endpoints/CDN.ts";

export type AllowedFormats = "webp" | "gif" | "png" | "jpg" | "jpeg";
export type AllowedSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export interface AvatarOptions {
  format?: AllowedFormats;
  size?: AllowedSizes;
  dynamic?: boolean;
}

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

  public getAvatarURL(user: User, options: AvatarOptions = {
    format: "webp",
    size: 256,
    dynamic: false,
  }): string | undefined {
    if (!user.avatar) return;

    if (!options.format) options.format = "webp";
    if (!options.size) options.size = 256;
    if (typeof options.dynamic !== "undefined") options.dynamic = false;

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

  public getDefaultAvatarURL(user: User): string {
    if (user.isPartial) throw new Error("User should not be partial.");
    return USER_DEFAULT_AVATAR(user.discriminator as string);
  }

  public getDisplayAvatarURL(user: User, options?: AvatarOptions) {
    return this.getAvatarURL(user, options) || this.getDefaultAvatarURL(user);
  }
}
