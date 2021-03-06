import { Client } from "../client/Client.ts";
import { Channel } from "../models/Channel.ts";
import { GuildEmoji } from "../models/GuildEmoji.ts";
import { Guild } from "../models/Guild.ts";
import { Role } from "../models/Role.ts";
import { User } from "../models/User.ts";
import {
  RawGuild,
  RawUser,
  RawEmoji,
  RawChannel,
  RawGuildMember,
  RawPresenceUpdate,
  RawActivity,
} from "../util/RawStructures.ts";
import { GuildMember } from "../models/GuildMember.ts";
import { VoiceState } from "../models/VoiceState.ts";
import { Presence } from "../models/Presence.ts";
import { Activity } from "../models/Activity.ts";
import { Resolver } from "../util/Resolver.ts";

export class Cache {
  /** Map containing every cached users */
  public users: Map<string, User> = new Map();
  /** Map containing every cached guilds */
  public guilds: Map<string, Guild> = new Map();
  /** Map containing every cached emojis */
  public emojis: Map<string, GuildEmoji> = new Map();
  /** Map containing every cached channels */
  public channels: Map<string, Channel> = new Map();
  /** Set containing IDs of unavailable guilds */
  public unavailableGuilds: Set<string> = new Set();

  constructor(public client: Client) {}

  /** Cache an User */
  public addUser(structure: RawUser): User {
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
  public addEmoji(structure: RawEmoji, guild: Guild): GuildEmoji {
    const cached: GuildEmoji | undefined = this.emojis.get(
      structure.id as string,
    );
    if (cached) return this.patchEmoji(cached, structure);

    const toCache: GuildEmoji = new GuildEmoji(structure, guild, this.client);
    this.emojis.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Emoji */
  public patchEmoji(emoji: GuildEmoji, structure: RawEmoji): GuildEmoji {
    if (structure.name) emoji.name = structure.name;

    if (structure.managed) emoji.managed = structure.managed;
    if (structure.animated) emoji.animated = structure.animated;
    if (structure.available) emoji.available = structure.available;
    if (structure.require_colons) {
      emoji.requireColons = structure.require_colons;
    }
    if (structure.roles) {
      structure.roles.forEach((roleID) => {
        emoji.roles.set(roleID, emoji.guild().roles.get(roleID) as Role);
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
    if (structure.name !== guild.name) guild.name = structure.name;
    if (structure.owner_id !== guild.ownerID) guild.ownerID = structure.owner_id;
    if (structure.afk_timeout !== guild.afkTimeout) guild.afkTimeout = structure.afk_timeout;
    guild.verificationLevel = structure.verification_level;
    guild.defaultMessageNotifications = structure.default_message_notifications;
    guild.explicitContentFilter = structure.explicit_content_filter;
    guild.features = structure.features;
    guild.mfaLevel = structure.mfa_level;

    if (structure.region !== guild.region) guild.region = structure.region;

    if (Boolean(structure.owner) !== Boolean(guild.owner)) {
      guild.owner = structure.owner;
    }

    if (structure.icon) guild.icon = structure.icon;
    if (structure.splash) guild.splash = structure.splash;
    if (structure.discovery_splash) {
      guild.discoverySplash = structure.discovery_splash;
    }
    if (structure.permissions) guild.permissions = structure.permissions;
    if (structure.afk_channel_id) guild.afkChannelID = structure.afk_channel_id;

    if (structure.application_id) {
      guild.applicationID = structure.application_id;
    }
    if (structure.member_count) guild.memberCount = structure.member_count;

    return guild;
  }

  public loadFullGuild(guild: Guild, structure: RawGuild) {
    structure.roles.map((role): void => {
      guild.roles.set(role.id, new Role(role, guild, this.client));
    });
    structure.emojis.map((emoji): void => {
      guild.emojis.set(emoji.id as string, this.addEmoji(emoji, guild));
    });

    structure.voice_states?.map((voiceState): void => {
      guild.voiceStates.push(new VoiceState(voiceState, guild, this.client));
    });

    structure.members?.map((member): void => {
      guild.members.set(
        ((member.user) as RawUser).id,
        new GuildMember(member, guild, this.client),
      );
    });

    structure.channels?.map((channel): void => {
      guild.channels.set(channel.id, this.addChannel(channel));
    });

    return guild;
  }

  /** Cache a Channel */
  public addChannel(structure: RawChannel): Channel {
    const cached: Channel | undefined = this.channels.get(structure.id);
    if (cached) return this.patchChannel(cached, structure);

    const toCache: Channel = new Channel(structure, this.client);
    this.channels.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached Channel */
  public patchChannel(channel: Channel, structure: RawChannel): Channel {
    // todo(): patcher for Channel
    const structureType = Resolver.toStringChannelType(structure.type);
    if (structureType !== channel.type) channel.type = structureType;

    return channel;
  }

  public patchMember(
    member: GuildMember,
    structure: RawGuildMember,
  ): GuildMember {
    const guild = member.guild();

    if (structure.premium_since) member.premiumSince = structure.premium_since;
    member.nick = structure.nick;
    member.deaf = structure.deaf;
    member.mute = structure.mute;

    structure.roles.forEach((roleID) => {
      if (!member.roles.has(roleID)) {
        member.roles.set(roleID, guild.roles.get(roleID) as Role);
      }
    });

    member.roles.forEach((role) => {
      if (!structure.roles.includes(role.id)) member.roles.delete(role.id);
    });

    return member;
  }

  public patchActivity(activity: Activity, structure: RawActivity) {
    activity.url = structure.url;

    if (activity.name !== structure.name) activity.name = structure.name;
    if (activity.type !== structure.type) activity.type = structure.type;

    if (activity.createdAt !== structure.created_at) {
      activity.createdAt = structure.created_at;
    }
    if (structure.timestamps) {
      activity.timestamps = structure.timestamps;
    }
  }

  public patchPresence(presence: Presence, structure: RawPresenceUpdate) {
    // Todo(Cat66000)

    presence.roles = structure.roles;
  }
}
