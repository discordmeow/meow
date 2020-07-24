import { Client } from "../../client/Client.ts";
import { Channel } from "../../models/Channel.ts";
import { WebSocketHandler } from "../WebSocketHandler.ts";
import { RawChannel, RawGuild, RawReadyEvent } from "./RawStructures.ts";

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
    }
  }

  private handleReady({ session_id, guilds }: RawReadyEvent) {
    this.ws.sessionID = session_id;

    guilds.forEach((guild) => {
      this.client.cache.addGuild(guild);
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
    const channel: Channel = <Channel> this.client.cache.channels.get(data.id);
    if (channel.guildID) {
      this.client.cache.addGuild(channel.guildID)?.channels.delete(channel.id);
    }
    this.client.cache.channels.delete(channel.id);
    this.client.events.channelDelete.post(channel);
  }

  private handleGuildCreate(data: RawGuild) {
    const guild = this.client.cache.addGuild(data);

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
}
