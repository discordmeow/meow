interface ChannelStructure {
  id: string;
}

export class Channel {
  readonly id: string;
  constructor(structure: ChannelStructure) {
    this.id = structure.id;
  }
}
