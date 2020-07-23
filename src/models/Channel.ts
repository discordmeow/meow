import { Client } from "../client/Client.ts";
import { Resolver } from "../util/Resolver.ts";

export type ChannelTypes =
  | "GUILD_TEXT"
  | "DM"
  | "GUILD_VOICE"
  | "GROUP_DM"
  | "GUILD_CATEGORY"
  | "GUILD_NEWS"
  | "GUILD_STORE";

export class Channel {
  /** the id of this channel */
  public readonly id: string;
  /** the type of channel */
  public type: ChannelTypes;
  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.type = Resolver.toHumanReadableChannelType(structure.type);
  }
}

// todo(n1c00o): Channel Structure
// ! Please don't touch to this file
