import { Client } from "../client/Client.ts";

interface MessageStructure {
  id: string;
  channelID?: string;
  guildID?: string;
}

export class Message {
  constructor(structure: MessageStructure, public client: Client) {}
}
