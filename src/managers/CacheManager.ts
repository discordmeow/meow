import { Client } from '../client/Client.ts';
import { Emoji } from '../models/Emoji.ts';
import { Guild } from '../models/Guild.ts';
import { Role } from '../models/Role.ts';
import { User } from '../models/User.ts';

export class CacheManager {
  /** Map containing every cached users */
  public users: Map<string, User> = new Map<string, User>();
  public guilds: Map<string, Guild> = new Map<string, Guild>();
  public emojis: Map<string, Emoji> = new Map<string, Emoji>();

  constructor(public client: Client) {}

  /** Cache a User (update the user if it is already cached) */
  public cacheUser(structure: any): User {
    const cached: User | undefined = this.users.get(structure.id);
    if (cached) return this.patchUser(cached, structure);

    const toCache: User = new User(structure, this.client);
    this.users.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached user */
  public patchUser(user: User, structure: any): User {
    if (structure.username) user.username = structure.username;
    if (structure.discriminator) user.discriminator = structure.discriminator;
    if (structure.avatar) user.avatarHash = structure.avatar;
    if (structure.bot) user.bot = Boolean(structure.bot);
    if (structure.system) user.system = Boolean(structure.system);
    if (structure.mfa_enabled) user.mfaEnabled = Boolean(structure.mfa_enabled);
    if (structure.locale) user.locale = structure.locale;
    // if (patch.flags) user.flags = patch.flags;
    if (structure.premium_type) user.premiumType = structure.premium_type;
    if (structure.public_flags) user.publicFlags = structure.public_flags;
    this.users.set(user.id, user);
    return user;
  }

  public cacheEmoji(structure: any, guild: Guild): Emoji {
    const cached: Emoji | undefined = this.emojis.get(structure.id);
    if (cached) return this.patchEmoji(cached, structure);

    const toCache: Emoji = new Emoji(structure, guild, this.client)
    this.emojis.set(toCache.id, toCache);
    return toCache;
  }

  public patchEmoji(emoji: Emoji, structure: any): Emoji {
    if (structure.name) emoji.name = structure.name;
    if (structure.user) emoji.user = this.cacheUser(structure.user);
    if (structure.managed) emoji.managed = structure.managed;
    if (structure.animated) emoji.animated = structure.animated;
    if (structure.available) emoji.available = structure.available;
    if (structure.require_colons) emoji.requireColons = structure.require_colons;
    if (structure.roles) emoji.roles = structure.roles.map((role: any): Role => { 
      return <Role>emoji.guild.roles.get(role.id);
    })
    this.emojis.set(emoji.id, emoji);
    return emoji;
  }

  public cacheGuild(structure: any): Guild {
    const cached: Guild | undefined = this.guilds.get(structure.id);
    if (cached) return this.patchGuild(cached, structure);
    
    const toCache: Guild = new Guild(structure, this.client);
    this.guilds.set(toCache.id, toCache);
    return toCache;
  }

  public patchGuild(guild: Guild, structure: any): Guild {
    if (structure.name) guild.name = structure.name;
    this.guilds.set(guild.id, guild);
    return guild;
  }
}
