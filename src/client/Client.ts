import { UsersManager } from './managers/UsersManager.ts';

export class Client {
  public readonly users: UsersManager;

  constructor() {
    this.users = new UsersManager(this);
  }
}
