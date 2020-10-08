export class BaseStructure {
  constructor(
    /** The ID */
    public readonly id: string,
  ) {}

  public toString() {
    return this.valueOf();
  }

  public valueOf() {
    return this.id;
  }
}
