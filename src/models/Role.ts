import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { RawRole } from "../util/RawStructures.ts";

export class Role {
  public readonly id: string;
  public name: string;
  public color: number;
  public hoist: boolean;
  public position: number;
  public permissions: number;
  public managed: boolean;
  public mentionnable: boolean;

  constructor(
    structure: RawRole,
    public guild: Guild,
    public client: Client,
  ) {
    this.id = structure.id;
    this.name = structure.name;
    this.color = structure.color;
    this.hoist = structure.hoist;
    this.position = structure.position;
    this.permissions = structure.permissions;
    this.managed = structure.managed;
    this.mentionnable = structure.mentionnable;
  }
}
