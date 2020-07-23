import { Client } from "../client/Client.ts";
import { Channel } from "../models/Channel.ts";
import { Emoji } from "../models/Emoji.ts";
import { Guild } from "../models/Guild.ts";
import { Role } from "../models/Role.ts";
import { User } from "../models/User.ts";

export class CacheManager {
  /** Map containing every cached users */
  public users: Map<string, User> = new Map();
  /** Map containing every cached guilds */
  public guilds: Map<string, Guild> = new Map();
  /** Map containing every cached emojis */
  public emojis: Map<string, Emoji> = new Map();
  /** Map containing every cached channels */
  public channels: Map<string, Channel> = new Map();
  /** Set containing IDs of unavailable guilds */
  public unavailableGuilds: Set<string> = new Set();

  constructor(public client: Client) {}

  /** Cache an User */
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
    if (structure.premium_type) user.premiumType = structure.premium_type;
    if (structure.public_flags) user.publicFlags = structure.public_flags;

    return user;
  }

  /** Cache an Emoji */
  public cacheEmoji(structure: any, guild: Guild): Emoji {
    const cached: Emoji | undefined = this.emojis.get(structure.id);
    if (cached) return this.patchEmoji(cached, structure);

    const toCache: Emoji = new Emoji(structure, guild, this.client);
    this.emojis.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Emoji */
  public patchEmoji(emoji: Emoji, structure: any): Emoji {
    if (structure.name) emoji.name = structure.name;
    if (structure.user) emoji.user = this.cacheUser(structure.user);
    if (structure.managed) emoji.managed = structure.managed;
    if (structure.animated) emoji.animated = structure.animated;
    if (structure.available) emoji.available = structure.available;
    if (structure.require_colons) {
      emoji.requireColons = structure.require_colons;
    }
    if (structure.roles) {
      emoji.roles = structure.roles.map((role: any): Role => {
        return <Role> emoji.guild.roles.get(role.id);
      });
    }

    return emoji;
  }

  /** Cache a Guild */
  public cacheGuild(structure: any): Guild {
    const cached: Guild | undefined = this.guilds.get(structure.id);
    if (cached) return this.patchGuild(cached, structure);

    const toCache: Guild = new Guild(structure, this.client);
    this.guilds.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Guild */
  public patchGuild(guild: Guild, structure: any): Guild {
    // todo(n1c00o): patcher with Guild props

    return guild;
  }

  /** Cache a Channel */
  public cacheChannel(structure: any): Channel {
    const cached: Channel | undefined = this.channels.get(structure.id);
    if (cached) return this.patchChannel(cached, structure);

    const toCache: Channel = new Channel(structure, this.client);
    this.channels.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached Channel */
  public patchChannel(channel: Channel, structure: any): Channel {
    // todo(n1c00o): patcher for Channel
    return channel;
  }
}
