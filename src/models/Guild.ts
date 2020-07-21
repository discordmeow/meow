interface GuildStructure {
  id: string;
}

export class Guild {
  readonly id: string;
  constructor(structure: GuildStructure) {
    this.id = structure.id
  }
}
