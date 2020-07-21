import { UserManager } from './managers/UserManager.ts';

export class Client {
  readonly users: UserManager;

  constructor() {
    this.users = new UserManager(this);
  }
}
