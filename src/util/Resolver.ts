import { ChannelTypes } from "../models/Channel.ts";

export class Resolver {
  private static _channelTypes: ChannelTypes[] = [
    "GUILD_TEXT",
    "DM",
    "GUILD_VOICE",
    "GROUP_DM",
    "GUILD_CATEGORY",
    "GUILD_NEWS",
    "GUILD_STORE",
  ];

  /** Convert an API channel.type to a human readable one */
  public static toHumanReadableChannelType(type: number): ChannelTypes {
    if (!this._channelTypes[type]) {
      throw new RangeError("'type' must be between 0 and 6!");
    }
    return this._channelTypes[type];
  }

  /** Convert a human readable channel type to the API index */
  public static toAPIChannelType(type: ChannelTypes): number {
    if (!this._channelTypes.includes(type)) {
      throw new TypeError("'type' must be a valid ChannelType!");
    }
    return this._channelTypes.indexOf(type);
  }
}
