interface MessageStructure {
  id: string;
  channelID?: string;
  guildID?: string;
}

export class Message {
  constructor(structure: MessageStructure) {}
}
