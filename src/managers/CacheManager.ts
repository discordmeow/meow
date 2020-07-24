import { Client } from "../client/Client.ts";
import { Channel } from "../models/Channel.ts";
import { Emoji } from "../models/Emoji.ts";
import { Guild } from "../models/Guild.ts";
import { Role } from "../models/Role.ts";
import { User } from "../models/User.ts";
import {
  RawGuild,
  RawUser,
  RawRole,
  RawEmoji,
} from "../network/event_handling/RawStructures.ts";

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
  public addUser(structure: any): User {
    const cached: User | undefined = this.users.get(structure.id);
    if (cached) return this.patchUser(cached, structure);

    const toCache: User = new User(structure, this.client);
    this.users.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached user */
  public patchUser(user: User, structure: RawUser): User {
    if (structure.username) user.username = structure.username;
    if (structure.discriminator) user.discriminator = structure.discriminator;
    if (structure.avatar) user.avatar = structure.avatar;
    if (structure.bot) user.bot = Boolean(structure.bot);
    if (structure.system) user.system = Boolean(structure.system);
    if (structure.mfa_enabled) user.mfaEnabled = Boolean(structure.mfa_enabled);
    if (structure.locale) user.locale = structure.locale;
    if (structure.premium_type) user.premiumType = structure.premium_type;
    if (structure.public_flags) user.publicFlags = structure.public_flags;

    return user;
  }

  /** Cache an Emoji */
  public addEmoji(structure: RawEmoji, guild: Guild): Emoji {
    const cached: Emoji | undefined = this.emojis.get(structure.id as string);
    if (cached) return this.patchEmoji(cached, structure);

    const toCache: Emoji = new Emoji(structure, guild, this.client);
    this.emojis.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Emoji */
  public patchEmoji(emoji: Emoji, structure: RawEmoji): Emoji {
    if (structure.name) emoji.name = structure.name;
    if (structure.user) emoji.user = this.addUser(structure.user);
    if (structure.managed) emoji.managed = structure.managed;
    if (structure.animated) emoji.animated = structure.animated;
    if (structure.available) emoji.available = structure.available;
    if (structure.require_colons) {
      emoji.requireColons = structure.require_colons;
    }
    if (structure.roles) {
      structure.roles.forEach((roleID) => {
        emoji.roles.set(roleID, emoji.guild.roles.get(roleID) as Role);
      });
    }

    return emoji;
  }

  /** Cache a Guild */
  public addGuild(structure: RawGuild): Guild {
    const cached: Guild | undefined = this.guilds.get(structure.id);
    if (cached) return this.patchGuild(cached, structure);

    const toCache: Guild = new Guild(structure, this.client);
    this.guilds.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Guild */
  public patchGuild(guild: Guild, structure: RawGuild): Guild {
    if (structure.name) guild.name = structure.name;
    if (structure.icon) guild.icon = structure.icon;
    if (structure.splash) guild.splash = structure.splash;
    if (structure.discovery_splash) {
      guild.discoverySplash = structure.discovery_splash;
    }
    if (structure.owner) guild.owner = structure.owner;
    if (structure.owner_id) guild.ownerID = structure.owner_id;
    if (structure.permissions) guild.permissions = structure.permissions;
    if (structure.region) guild.region = structure.region;
    if (structure.afk_channel_id) guild.afkChannelID = structure.afk_channel_id;
    if (structure.afk_timeout) guild.afkTimeout = structure.afk_timeout;
    if (structure.verification_level) {
      guild.verificationLevel = structure.verification_level;
    }
    if (structure.default_message_notifications) {
      guild.defaultMessageNotifications =
        structure.default_message_notifications;
    }
    if (structure.explicit_content_filter) {
      guild.explicitContentFilter = structure.explicit_content_filter;
    }
    if (structure.features) guild.features = structure.features;
    if (structure.mfa_level) guild.mfaLevel = structure.mfa_level;
    if (structure.application_id) {
      guild.applicationID = structure.application_id;
    }
    if (structure.member_count) guild.memberCount = structure.member_count;

    return guild;
  }

  /** Cache a Channel */
  public addChannel(structure: any): Channel {
    const cached: Channel | undefined = this.channels.get(structure.id);
    if (cached) return this.patchChannel(cached, structure);

    const toCache: Channel = new Channel(structure, this.client);
    this.channels.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached Channel */
  public patchChannel(channel: Channel, structure: any): Channel {
    // todo(): patcher for Channel
    return channel;
  }
}
