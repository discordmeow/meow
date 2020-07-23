import { Client } from "../client/Client.ts";

interface ChannelStructure {
  id: string;
}

export class Channel {
  readonly id: string;
  constructor(structure: ChannelStructure, public client: Client) {
    this.id = structure.id;
  }
}
