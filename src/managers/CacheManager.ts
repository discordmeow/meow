import { Client } from '../client/Client.ts';
import { Guild } from '../models/Guild.ts';
import { User } from '../models/User.ts';

export class CacheManager {
  /** Map containing every cached users */
  public users: Map<string, User> = new Map<string, User>();
  public guilds: Map<string, Guild> = new Map<string, Guild>();

  constructor(public client: Client) {}

  /** Update a cached user */
  private _patchUser(user: User, patch: any): User {
    if (patch.username) user.username = patch.username;
    if (patch.discriminator) user.discriminator = patch.discriminator;
    if (typeof patch.avatar !== 'undefined') user.avatarHash = patch.avatar;
    if (typeof patch.bot !== 'undefined') user.bot = Boolean(patch.bot);
    if (typeof patch.system !== 'undefined') user.system = Boolean(patch.system);
    if (patch.mfa_enabled) user.mfaEnabled = Boolean(patch.mfa_enabled);
    if (patch.locale) user.locale = patch.locale;
    // if (typeof patch.flags !== 'undefined') user.flags = patch.flags;
    if (patch.premium_type) user.premiumType = patch.premium_type;
    if (typeof patch.public_flags !== 'undefined') user.publicFlags = patch.public_flags;
    return user;
  }

  /** Cache a User (update the user if it is already cached) */
  public cacheUser(data: any): User {
    const cached: User | undefined = this.users.get(data.id);
    if (cached) {
      this._patchUser(cached, data);
      return cached;
    }

    const toCache: User = new User(data, this.client);
    this.users.set(toCache.id, toCache);
    return toCache;
  }
}
