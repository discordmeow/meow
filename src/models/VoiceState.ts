import { Client } from '../client/Client.ts';
import { Guild } from './Guild.ts';
import { GuildMember } from './GuildMember.ts';

export class VoiceState {
  /** the guild id this voice state is for */
  public readonly guildID: string;
  /** the channel id this user is connected to */
  public channelID?: string;
  /** the user id this voice state is for */
  public userID: string;
  /** the guild member this voice state is for */
  public member!: GuildMember | null;
  /** the session id for this voice state */
  public sessionID: string;
  /** whether this user is deafened by the server */
  public deaf: boolean;
  /** whether this user is muted by the server */
  public mute: boolean;
  /** whether this user is deafened by the server */
  public selfDeaf: boolean;
  /** whether this user is locally muted */
  public selfMute: boolean;
  /** whether this user is streaming using "Go Live" */
  public selfStream!: boolean;
  /** whether this user's camera is enabled */
  public selfVideo: boolean;
  /** whether this user is muted by the current user */
  public suppress: boolean;

  constructor(structure: any, public guild: Guild, public client: Client) {
    this.guildID = structure.guild_id || guild.id;
    this.channelID = structure.channel_id;
    this.userID = structure.user_id;
    if (structure.member) this.member = guild.members.get(structure.member.user.id) ?? null;
    this.sessionID = structure.session_id;
    this.deaf = structure.deaf;
    this.mute = structure.mute;
    this.selfDeaf = structure.self_deaf;
    this.selfMute = structure.self_mute;
    if (structure.self_stream) this.selfStream = structure.self_stream;
    this.selfVideo = structure.self_video;
    this.suppress = structure.suppress;
  }
}
