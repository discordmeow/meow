import { Client } from "../client/Client.ts";
import { RawMessage } from "../util/RawStructures.ts";
import { BaseStructure } from "./Base.ts";

export class Message extends BaseStructure {
  constructor(structure: RawMessage, public client: Client) {
    super(structure.id);
  }
}
