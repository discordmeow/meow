import { Client } from "../../client/Client.ts";
import { Channel } from "../../models/Channel.ts";
import { Guild } from "../../models/Guild.ts";
import { GuildEmoji } from "../../models/GuildEmoji.ts";
import { GuildMember } from "../../models/GuildMember.ts";
import { Role } from "../../models/Role.ts";
import { WebSocketHandler } from "../WebSocketHandler.ts";
import {
  RawChannel,
  RawChannelPinsUpdate,
  RawGuild,
  RawGuildBan,

  RawGuildEmojisUpdate,
  RawGuildIntegrationsUpdate,

  RawGuildMemberAdd,
  RawGuildMemberRemove,
  RawGuildMembersChunk,
  RawGuildMemberUpdate,
  RawReady,
} from "./RawStructures.ts";

export interface EventData {
  name: string;
  data: any;
}

export enum EventTypes {
  READY = "READY",
  RESUMED = "RESUMED",
  CHANNEL_CREATE = "CHANNEL_CREATE",
  CHANNEL_UPDATE = "CHANNEL_UPDATE",
  CHANNEL_DELETE = "CHANNEL_DELETE",
  CHANNEL_PINS_UPDATE = "CHANNEL_PINS_UPDATE",
  GUILD_CREATE = "GUILD_CREATE",
  GUILD_UPDATE = "GUILD_UPDATE",
  GUILD_DELETE = "GUILD_DELETE",
  GUILD_BAN_ADD = "GUILD_BAN_ADD",
  GUILD_BAN_REMOVE = "GUILD_BAN_REMOVE",
  GUILD_EMOJIS_UPDATE = "GUILD_EMOJIS_UPDATE",
  GUILD_INTEGRATIONS_UPDATE = "GUILD_INTEGRATIONS_UPDATE",
  GUILD_MEMBER_ADD = "GUILD_MEMBER_ADD",
  GUILD_MEMBER_REMOVE = "GUILD_MEMBER_REMOVE",
  GUILD_MEMBER_UPDATE = "GUILD_MEMBER_UPDATE",
  GUILD_MEMBERS_CHUNK = "GUILD_MEMBERS_CHUNK",
  GUILD_ROLE_CREATE = "GUILD_ROLE_CREATE",
  GUILD_ROLE_UPDATE = "GUILD_ROLE_UPDATE",
  GUILD_ROLE_DELETE = "GUILD_ROLE_DELETE",
  INVITE_CREATE = "INVITE_CREATE",
  INVITE_DELETE = "INVITE_DELETE",
  MESSAGE_CREATE = "MESSAGE_CREATE",
  MESSAGE_UPDATE = "MESSAGE_UPDATE",
  MESSAGE_DELETE = "MESSAGE_DELETE",
  MESSAGE_DELETE_BULK = "MESSAGE_DELETE_BULK",
  MESSAGE_REACTION_ADD = "MESSAGE_REACTION_ADD",
  MESSAGE_REACTION_REMOVE = "MESSAGE_REACTION_REMOVE",
  MESSAGE_REACTION_REMOVE_ALL = "MESSAGE_REACTION_REMOVE_ALL",
  MESSAGE_REACTION_REMOVE_EMOJI = "MESSAGE_REACTION_REMOVE_EMOJI",
  PRESENCE_UPDATE = "PRESENCE_UPDATE",
  TYPING_START = "TYPING_START",
  USER_UPDATE = "USER_UPDATE",
  VOICE_STATE_UPDATE = "VOICE_STATE_UPDATE",
  VOICE_SERVER_UPDATE = "VOICE_SERVER_UPDATE",
  WEBHOOKS_UPDATE = "WEBHOOKS_UPDATE",
}

export class EventHandler {
  constructor(public ws: WebSocketHandler, public client: Client) {}

  public handle({ name, data }: EventData) {
    switch (name) {
      case EventTypes.READY:
        this.handleReady(data);
        break;
      case EventTypes.GUILD_CREATE:
        this.handleGuildCreate(data);
        break;
      case EventTypes.CHANNEL_CREATE:
        this.handleChannelCreate(data);
        break;
      case EventTypes.CHANNEL_UPDATE:
        this.handleChannelUpdate(data);
        break;
      case EventTypes.CHANNEL_DELETE:
        this.handleChannelDelete(data);
        break;
      case EventTypes.CHANNEL_PINS_UPDATE:
        this.handleChannelPinsUpdate(data);
        break;
      case EventTypes.GUILD_UPDATE:
        this.handleGuildUpdate(data);
        break;
      case EventTypes.GUILD_DELETE:
        this.handleGuildDelete(data);
        break;
      case EventTypes.GUILD_BAN_ADD:
        this.handleGuildBanAdd(data);
        break;
      case EventTypes.GUILD_BAN_REMOVE:
        this.handleGuildBanRemove(data);
        break;
      case EventTypes.GUILD_EMOJIS_UPDATE:
        this.handleGuildEmojisUpdate(data);
        break;
      case EventTypes.GUILD_INTEGRATIONS_UPDATE:
        this.handleGuildIntegrationsUpdate(data);
        break;
      case EventTypes.GUILD_MEMBER_ADD:
        this.handleGuildMemberAdd(data);
        break;
      case EventTypes.GUILD_MEMBER_REMOVE:
        this.handleGuildMemberRemove(data);
        break;
      case EventTypes.GUILD_MEMBER_UPDATE:
        this.handleGuildMemberUpdate(data);
        break;
      case EventTypes.GUILD_MEMBERS_CHUNK:
        this.handleGuildMembersChunk(data);
        break;
    }
  }

  private handleReady({ session_id, guilds }: RawReady) {
    this.ws.sessionID = session_id;

    guilds.forEach((guild) => {
      this.client.cache.addGuild(guild as RawGuild);
      this.ws.initialUnavailableGuilds.add(guild.id);
    });

    this.client.events.ready.post();
  }

  private handleChannelCreate(data: RawChannel) {
    const channel: Channel = this.client.cache.addChannel(data);
    if (channel.guildID) {
      this.client.cache.guilds.get(channel.guildID)?.channels.set(
        channel.id,
        channel,
      );
    }
    this.client.events.channelCreate.post(channel);
  }

  private handleChannelUpdate(data: RawChannel) {
    const channel: Channel = this.client.cache.addChannel(data);
    this.client.events.channelUpdate.post(channel);
  }

  private handleChannelDelete(data: RawChannel) {
    const channel: Channel = this.client.cache.channels.get(data.id) as Channel;

    channel.guild?.channels.delete(
      channel.id,
    );

    this.client.cache.channels.delete(channel.id);
    this.client.events.channelDelete.post(channel);
  }

  private handleChannelPinsUpdate(data: RawChannelPinsUpdate) {
    const channel: Channel | undefined = this.client.cache.channels.get(
      data.channel_id,
    );
    if (channel && data.last_pin_timestamp) {
      channel.lastPinTimestamp = data.last_pin_timestamp;
    }
    this.client.events.channelPinsUpdate.post(
      {
        channel: channel,
        guild: this.client.cache.guilds.get(data.guild_id ?? ""),
        lastPinTimestamp: data.last_pin_timestamp,
      },
    );
  }

  private handleGuildCreate(data: RawGuild) {
    const guild = this.client.cache.addGuild(data);
    this.client.cache.loadFullGuild(guild, data);

    if (
      !this.client.cache.unavailableGuilds.has(data.id) &&
      !data.unavailable && !this.ws.initialUnavailableGuilds.has(data.id)
    ) {
      this.client.events.guildCreate.post(guild);
    } else if (
      this.client.cache.unavailableGuilds.has(data.id) && !data.unavailable
    ) {
      this.client.cache.unavailableGuilds.delete(data.id);

      this.client.events.guildAvailable.post(guild);
    } else if (data.unavailable) {
      this.client.cache.unavailableGuilds.add(data.id);

      this.client.events.guildUnavailable.post(guild);
    }

    if (this.ws.initialUnavailableGuilds.has(data.id)) {
      this.ws.initialUnavailableGuilds.delete(data.id);
    }
  }

  private handleGuildUpdate(data: RawGuild) {
    const guild: Guild = this.client.cache.addGuild(data);
    this.client.events.guildUpdate.post(guild);
  }

  private handleGuildDelete(
    data: { id: string; unavailable?: boolean | null },
  ) {
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.id);
    if (data.unavailable) {
      this.client.cache.unavailableGuilds.add(data.id);
      this.client.events.guildUnavailable.post(guild);
    } else {
      this.client.cache.guilds.delete(data.id);
      this.client.events.guildDelete.post(guild);
    }
  }

  private handleGuildBanAdd(data: RawGuildBan) {
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.guild_id);
    guild.members.delete(data.user.id);
    this.client.events.guildBanAdd.post(
      {
        guild: guild,
        user: this.client.cache.addUser(data.user),
      },
    );
  }

  private handleGuildBanRemove(data: RawGuildBan) {
    this.client.events.guildBanRemove.post(
      {
        guild: <Guild> this.client.cache.guilds.get(data.guild_id),
        user: this.client.cache.addUser(data.user),
      },
    );
  }

  private handleGuildEmojisUpdate(data: RawGuildEmojisUpdate) {
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.guild_id);
    this.client.events.guildEmojisUpdate.post(
      {
        guild: guild,
        emojis: data.emojis.map<GuildEmoji>((emoji) =>
          this.client.cache.addEmoji(emoji, guild)
        ),
      },
    );
  }

  private handleGuildIntegrationsUpdate(data: RawGuildIntegrationsUpdate) {
    this.client.events.guildIntegrationsUpdate.post(
      <Guild> this.client.cache.guilds.get(data.guild_id),
    );
  }

  private handleGuildMemberAdd(data: RawGuildMemberAdd) {
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.guild_id);
    const member: GuildMember = new GuildMember(data, guild, this.client);
    guild.members.set(member.user.id, member);
    this.client.events.guildMemberAdd.post(member);
  }

  private handleGuildMemberRemove(data: RawGuildMemberRemove) {
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.guild_id);
    guild.members.delete(data.user.id);
    this.client.events.guildMemberRemove.post(
      { guild: guild, user: this.client.cache.addUser(data.user) },
    );
  }

  private handleGuildMemberUpdate(data: RawGuildMemberUpdate) {
    const member: GuildMember =
      <GuildMember> (<Guild> this.client.cache.guilds.get(data.guild_id))
        .members.get(data.user.id);
    if (data.nick) member.nick = data.nick;
    if (data.premium_since) member.premiumSince = data.premium_since;
    member.user = this.client.cache.patchUser(member.user, data.user);
    data.roles.forEach((roleID) => {
      if (!member.roles.has(roleID)) {
        member.roles.set(roleID, <Role> member.guild.roles.get(roleID));
      }
    });
    this.client.cache.guilds.get(data.guild_id)?.members.set(
      member.user.id,
      member,
    );
    this.client.events.guildMemberUpdate.post(member);
  }

  private handleGuildMembersChunk(data: RawGuildMembersChunk) {
    // todo("models" branch): Presence model
    const guild: Guild = <Guild> this.client.cache.guilds.get(data.guild_id);
    const members: GuildMember[] = data.members.map<GuildMember>((member) => {
      const m: GuildMember = this.client.cache.patchMember(
        <GuildMember> guild.members.get(<string> member.user?.id),
        member,
      );
      guild.members.set(m.user.id, m);
      return m;
    });
    this.client.events.guildMembersChunk.post(
      {
        guild: guild,
        members: members,
        chunkIndex: data.chunk_index,
        chunkCount: data.chunk_count,
        notFound: data.not_found,
        presences: [null],
        nonce: data.nonce,
      },
    );
  }
}
