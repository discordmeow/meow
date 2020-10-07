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
  RawVoiceState,
} from "../util/RawStructures.ts";
import { GuildMember } from "../models/GuildMember.ts";
import { VoiceState } from "../models/VoiceState.ts";
import { Presence } from "../models/Presence.ts";
import { Activity } from "../models/Activity.ts";
import { Resolver } from "../util/Resolver.ts";

export class Cache {
  /** Map containing every cached users */
  public users = new Map<string, User>();
  /** Map containing every cached guilds */
  public guilds = new Map<string, Guild>();
  /** Map containing every cached emojis */
  public emojis = new Map<string, GuildEmoji>();
  /** Map containing every cached channels */
  public channels = new Map<string, Channel>();
  /** Set containing IDs of unavailable guilds */
  public unavailableGuilds = new Set<string>();

  constructor(public client: Client) {}

  /** Cache an User */
  public addUser(structure: RawUser): User {
    const cached = this.users.get(structure.id);
    if (cached) return this.patchUser(cached, structure);

    const toCache = new User(structure, this.client);
    this.users.set(toCache.id, toCache);
    return toCache;
  }

  /** Update a cached user */
  public patchUser(user: User, structure: RawUser): User {
    user.avatar = structure.avatar;

    if (typeof structure.premium_type !== "undefined") {
      user.premiumType = structure.premium_type;
    }
    if (typeof structure.mfa_enabled !== "undefined") {
      user.mfaEnabled = structure.mfa_enabled;
    }
    if (typeof structure.system !== "undefined") {
      user.system = structure.system;
    }
    if (typeof structure.public_flags !== "undefined") {
      user.publicFlags = structure.public_flags;
    }
    if (typeof structure.locale !== "undefined") user.locale = structure.locale;
    if (typeof structure.bot !== "undefined") user.bot = structure.bot;

    if (structure.username && (structure.username !== user.username)) {
      user.username = structure.username;
    }
    if (
      structure.discriminator &&
      (structure.discriminator !== user.discriminator)
    ) {
      user.discriminator = structure.discriminator;
    }

    return user;
  }

  /** Cache an Emoji */
  public addEmoji(structure: RawEmoji, guild: Guild): GuildEmoji {
    const cached = this.emojis.get(
      structure.id as string,
    );
    if (cached) return this.patchGuildEmoji(cached, structure);

    const toCache = new GuildEmoji(structure, guild, this.client);
    this.emojis.set(toCache.id, toCache);
    guild.emojis.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Emoji */
  public patchGuildEmoji(emoji: GuildEmoji, structure: RawEmoji): GuildEmoji {
    const guild = emoji.guild();

    emoji.name = structure.name as string;

    emoji.managed = structure.managed as boolean;
    emoji.animated = structure.animated as boolean;
    emoji.available = structure.available as boolean;
    emoji.requireColons = structure.require_colons as boolean;

    ((structure.roles) as string[]).forEach((roleID) => {
      emoji.roles.set(roleID, guild.roles.get(roleID) as Role);
    });

    return emoji;
  }

  /** Cache a Guild */
  public addGuild(structure: RawGuild): Guild {
    const cached = this.guilds.get(structure.id);
    if (cached) return this.patchGuild(cached, structure);

    const toCache = new Guild(structure, this.client);
    this.guilds.set(toCache.id, toCache);

    return toCache;
  }

  /** Update a cached Guild */
  public patchGuild(guild: Guild, structure: RawGuild): Guild {
    if (structure.name !== guild.name) guild.name = structure.name;
    if (structure.owner_id !== guild.ownerID) {
      guild.ownerID = structure.owner_id;
    }
    if (structure.afk_timeout !== guild.afkTimeout) {
      guild.afkTimeout = structure.afk_timeout;
    }
    if (structure.verification_level !== guild.verificationLevel) {
      guild.verificationLevel = structure.verification_level;
    }
    guild.defaultMessageNotifications = structure.default_message_notifications;
    guild.explicitContentFilter = structure.explicit_content_filter;
    guild.features = structure.features;
    guild.mfaLevel = structure.mfa_level;

    if (structure.region !== guild.region) guild.region = structure.region;

    if (
      typeof structure.owner !== "undefined" &&
      (structure.owner !== guild.owner)
    ) {
      guild.owner = structure.owner;
    }

    if (structure.icon !== guild.icon) guild.icon = structure.icon;
    if (structure.splash && (structure.splash !== guild.splash)) {
      guild.splash = structure.splash;
    }
    if (structure.discovery_splash && (structure.splash !== guild.splash)) {
      guild.discoverySplash = structure.discovery_splash;
    }
    if (
      typeof structure.permissions !== "undefined" &&
      (structure.permissions !== guild.permissions)
    ) {
      guild.permissions = structure.permissions;
    }
    if (structure.afk_channel_id !== guild.afkChannelID) {
      guild.afkChannelID = structure.afk_channel_id;
    }

    if (structure.application_id !== guild.applicationID) {
      guild.applicationID = structure.application_id;
    }
    if (
      typeof structure.member_count !== "undefined" &&
      (structure.member_count !== guild.memberCount)
    ) {
      guild.memberCount = structure.member_count;
    }

    return guild;
  }

  public loadFullGuild(guild: Guild, structure: RawGuild) {
    structure.roles.forEach((role): void => {
      guild.roles.set(role.id, new Role(role, guild, this.client));
    });
    structure.emojis.forEach((emoji): void => {
      this.addEmoji(emoji, guild);
    });

    guild.voiceStates = ((structure.voice_states) as RawVoiceState[]).map((
      voiceState,
    ): VoiceState => new VoiceState(voiceState, guild, this.client));

    structure.members?.forEach((member): void => {
      guild.members.set(
        ((member.user) as RawUser).id,
        new GuildMember(member, guild, this.client),
      );
    });

    structure.channels?.forEach((channel): void => {
      this.addChannel(channel, guild);
    });

    return guild;
  }

  /** Cache a Channel */
  public addChannel(structure: RawChannel, guild?: Guild): Channel {
    const cached = this.channels.get(structure.id);
    if (cached) return this.patchChannel(cached, structure);

    const toCache = new Channel(structure, this.client);
    this.channels.set(toCache.id, toCache);
    guild?.channels.set(toCache.id, toCache);

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
    const guildRoles = member.guild().roles;

    if (structure.premium_since) member.premiumSince = structure.premium_since;
    member.nick = structure.nick;
    member.deaf = structure.deaf;
    member.mute = structure.mute;

    structure.roles.forEach((roleID) => {
      if (!member.roles.has(roleID)) {
        member.roles.set(roleID, guildRoles.get(roleID) as Role);
      }
    });

    member.roles.forEach((role) => {
      if (!structure.roles.includes(role.id)) member.roles.delete(role.id);
    });

    return member;
  }

  public patchActivity(activity: Activity, structure: RawActivity) {
    activity.url = structure.url;

    if (structure.name !== activity.name) activity.name = structure.name;
    if (structure.type !== activity.type) activity.type = structure.type;

    if (activity.createdAt !== structure.created_at) {
      activity.createdAt = structure.created_at;
    }
    if (structure.timestamps) {
      activity.timestamps = structure.timestamps;
    }
    if (activity.applicationID !== structure.application_id) {
      activity.applicationID = structure.application_id;
    }
    if (activity.details !== structure.details) {
      activity.details = structure.details;
    }
    if (activity.state !== structure.state) {
      activity.state = structure.state;
    }
    if (activity.instance !== structure.instance) {
      activity.instance = structure.instance;
    }
    if (activity.flags !== structure.flags) {
      activity.flags = structure.flags;
    }
    if (activity.party !== structure.party) {
      activity.party = structure.party;
    }
    if (activity.secrets !== structure.secrets) {
      activity.secrets = structure.secrets;
    }
    // todo(#10): activity.emoji - Needs Emoji Object, waiting for the result of the #10 issue
  }

  public patchPresence(presence: Presence, structure: RawPresenceUpdate) {
    presence.status = structure.status;
    presence.clientStatus = structure.client_status;
    presence.status = structure.status;

    presence.activities = structure.activities.map((activity): Activity =>
      new Activity(activity, this.client)
    );
  }
}
