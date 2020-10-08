import { Client } from "../client/Client.ts";
import { Guild } from "./Guild.ts";
import { RawRole } from "../util/RawStructures.ts";
import { BaseStructure } from "./Base.ts";

export class Role extends BaseStructure {
  public name: string;
  public color: number;
  public hoist: boolean;
  public position: number;
  public permissions: number;
  public managed: boolean;
  public mentionnable: boolean;

  private _toString = `<@&${this.id}>`;

  constructor(
    structure: RawRole,
    public guild: Guild,
    public client: Client,
  ) {
    super(structure.id);

    this.name = structure.name;
    this.color = structure.color;
    this.hoist = structure.hoist;
    this.position = structure.position;
    this.permissions = Number(structure.permissions);
    this.managed = structure.managed;
    this.mentionnable = structure.mentionnable;
  }

  public toString() {
    return this._toString;
  }
}
