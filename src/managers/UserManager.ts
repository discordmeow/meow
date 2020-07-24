import { Client } from "../client/Client.ts";
import { User } from "../models/User.ts";
import { USER_AVATAR, USER_DEFAULT_AVATAR } from "../util/endpoints/CDN.ts";

export type AllowedFormats = "webp" | "gif" | "png" | "jpg" | "jpeg";
export type AllowedSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export class UserManager {
  constructor(public client: Client) {}

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
    if (user.isPartial) throw new Error("User should bot be partial.");
    return USER_DEFAULT_AVATAR(user.discriminator as string);
  }
}
