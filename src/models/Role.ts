import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";

export interface ReceivedRoleStructure {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  position: number;
  permissions: number;
  managed: boolean;
  mentionable: boolean;
}

export class Role {
  public readonly id: string;
  public name: string;
  public color: number;
  public hoist: boolean;
  public position: number;
  public permissions: number;
  public managed: boolean;
  public mentionable: boolean;

  constructor(
    structure: ReceivedRoleStructure,
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
    this.mentionable = structure.mentionable;
  }
}
