import { Client } from '../Client.ts';

type AllowedFormats = 'webp' | 'gif' | 'png' | 'jpg' | 'jpeg';
type AllowedSizes = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export class UsersManager {
  private _client: Client;

  constructor(client: Client) {
    this._client = client;
  }

  /**
   * Get the avatar URL of a User
   * @param {{userID: string; userAvatarHash: string; size?: AllowedSizes; format?: AllowedFormats; canBeDynamic?: boolean}} params - Required parameters 
   */
  public getAvatarURL(params: {
    userID: string;
    userAvatarHash: string;
    size?: AllowedSizes;
    format?: AllowedFormats;
    canBeDynamic?: boolean;
  }): string {
    if (typeof params.size === 'undefined' || ![16, 32, 64, 128, 256, 512, 1024, 2048, 4096].includes(params.size)) params.size = 256;
    if (typeof params.format === 'undefined' || !['webp', 'gif', 'png', 'jpg', 'jpeg'].includes(params.format)) params.format = 'webp';
    if (typeof params.canBeDynamic !== 'boolean') params.canBeDynamic = false; 
    return `https://cdn.discordapp.com/avatars/${
      params.userID
    }/${
      params.userAvatarHash
    }.${
      params.canBeDynamic && 
      params.userAvatarHash.startsWith('a_') ? 'gif' : params.format
    }`;
  }
}
