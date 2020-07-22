import { Client } from "../client/Client.ts";
import { User } from "../models/User.ts";
import { CDN_BASE_URL } from "../util/Constants.ts";

type AllowedFormats = "webp" | "gif" | "png" | "jpg" | "jpeg";
type AllowedSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export class UserManager {
  constructor(public client: Client) {
  }

  public getAvatarURL(user: User, params: {
    size?: AllowedSizes;
    format?: AllowedFormats;
    canBeDynamic?: boolean;
  } = {
    size: 256,
    format: "webp",
    canBeDynamic: false,
  }): string {
    if (user.isPartial) throw new Error("User should not be partial.");
    return `${CDN_BASE_URL}/avatars/${user.id}/${user.avatarHash}.${
      params.canBeDynamic && user.avatarHash?.startsWith("a_")
        ? "gif"
        : params.format
    }?size=${params.size}`;
  }

  public getDefaultAvatarURL(user: User, size: AllowedSizes): string {
    if (user.isPartial) throw new Error("User should bot be partial.");
    return `${CDN_BASE_URL}/embed/avatars/${user.id}/${Number(
      user.discriminator,
    ) % 5}.png?size=${String(size)}`;
  }
}
