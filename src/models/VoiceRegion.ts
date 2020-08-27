import { Client } from "../client/Client.ts";

export class VoiceRegion {
  /** unique ID for the region */
  public readonly id: string;
  /** name of the region */
  public name: string;
  /** `true` if this is a vip-only server */
  public vip: boolean;
  /** `true` for a single server that is closest to the current user's client */
  public optimal: boolean;
  /** whether this is a deprecated voice region (avoid switching to these) */
  public deprecated: boolean;
  /** whether this is a custom voice region (used for events/etc) */
  public custom: boolean;

  constructor(structure: any, public client: Client) {
    this.id = structure.id;
    this.name = structure.name;
    this.vip = structure.vip;
    this.optimal = structure.optimal;
    this.deprecated = structure.deprecated;
    this.custom = structure.custom;
  }
}
