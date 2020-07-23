import { AllowedFormats, AllowedSizes } from "../../managers/UserManager.ts";
import { CDN_BASE_URL as BASE_URL } from "../Constants.ts";

function buildImageURL(
  baseURL: string,
  { format, size }: { format: AllowedFormats; size?: AllowedSizes },
) {
  return `${baseURL}.${format}${size ? `?size=${size}` : ""}`;
}

export function CUSTOM_EMOJI(
  { emojiID, format = "png" }: {
    emojiID: string;
    format?: AllowedFormats;
  },
): string {
  return `${BASE_URL}/emojis/${emojiID}.${format}`;
}

export function GUILD_ICON(
  { guildID, iconHash, format = "webp", size, dynamic = false }: {
    guildID: string;
    iconHash: string;
    format?: AllowedFormats;
    size?: AllowedSizes;
    dynamic?: boolean;
  },
): string {
  if (dynamic) format = iconHash.startsWith("a_") ? "gif" : format;
  return buildImageURL(
    `${BASE_URL}/icons/${guildID}/${iconHash}`,
    { format, size },
  );
}

export function GUILD_SPLASH(
  { guildID, splashHash, format = "webp", size }: {
    guildID: string;
    splashHash: string;
    format?: AllowedFormats;
    size?: AllowedSizes;
  },
): string {
  return buildImageURL(
    `${BASE_URL}/splashes/${guildID}/${splashHash}`,
    { format, size },
  );
}

export function GUILD_DISCOVERY_SPLASH(
  { guildID, discoverySplashHash, format = "webp", size }: {
    guildID: string;
    discoverySplashHash: string;
    format?: AllowedFormats;
    size?: AllowedSizes;
  },
): string {
  return buildImageURL(
    `${BASE_URL}/discovery-splashes/${guildID}/${discoverySplashHash}`,
    { format, size },
  );
}

export function GUILD_BANNER(
  { guildID, bannerHash, format = "webp", size }: {
    guildID: string;
    bannerHash: string;
    format?: AllowedFormats;
    size?: AllowedSizes;
  },
): string {
  return buildImageURL(
    `${BASE_URL}/banners/${guildID}/${bannerHash}`,
    { format, size },
  );
}
export function USER_DEFAULT_AVATAR(userDiscriminator: string) {
  return `${BASE_URL}/embed/avatars/${+userDiscriminator % 5}.png`;
}

export function USER_AVATAR(
  { userID, avatarHash, format = "webp", size, dynamic }: {
    userID: string;
    avatarHash: string;
    format?: AllowedFormats;
    size?: AllowedSizes;
    dynamic?: boolean;
  },
): string {
  if (dynamic) format = avatarHash.startsWith("a_") ? "gif" : format;
  return buildImageURL(
    `${BASE_URL}/icons/${userID}/${avatarHash}`,
    { format, size },
  );
}
