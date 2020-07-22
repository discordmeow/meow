export const APIEndpoints = {
  GUILDS: "/guilds",
  GUILD: (guildID: string) => `/guilds/${guildID}`,
  GUILD_PREVIEW: (guildID: string) => `/guilds/${guildID}/preview`,
  GUILD_AUDIT_LOG: (guildID: string) => `/guilds/${guildID}/audit-logs`,
  GUILD_EMOJIS: (guildID: string) => `/guilds/${guildID}/emojis`,
  GUILD_EMOJI: ({ guildID, emojiID }: { guildID: string; emojiID: string }) =>
    `/guilds/${guildID}/emojis/${emojiID}`,
  GUILD_CHANNELS: (guildID: string) => `/guilds/${guildID}/channels`,
  GUILD_MEMBERS: (guildID: string) => `/guilds/${guildID}/members`,
  GUILD_MEMBER: ({ guildID, userID }: { guildID: string; userID: string }) =>
    `/guilds/${guildID}/members/${userID}`,
  GUILD_MEMBER_ME_NICK: (guildID: string) =>
    `/guilds/${guildID}/members/@me/nick`,
  GUILD_MEMBER_ROLE: (
    { guildID, userID, roleID }: {
      guildID: string;
      userID: string;
      roleID: string;
    },
  ) => `/guilds/${guildID}/members/${userID}/roles/${roleID}`,
  GUILD_BANS: (guildID: string) => `/guilds/${guildID}/bans`,
  GUILD_BAN: ({ guildID, userID }: { guildID: string; userID: string }) =>
    `/guilds/${guildID}/bans/${userID}`,
  GUILD_ROLES: (guildID: string) => `/guilds/${guildID}/roles`,
  GUILD_ROLE: ({ guildID, roleID }: { guildID: string; roleID: string }) =>
    `/guilds/${guildID}/roles/${roleID}`,
  GUILD_PRUNE: (guildID: string) => `/guilds/${guildID}/prune`,
  GUILD_VOICE_REGIONS: (guildID: string) => `/guilds/${guildID}/regions`,
  GUILD_INVITES: (guildID: string) => `/guilds/${guildID}/invites`,
  GUILD_INTEGRATIONS: (guildID: string) => `/guilds/${guildID}/integrations`,
  GUILD_INTEGRATION: (
    { guildID, integrationID }: { guildID: string; integrationID: string },
  ) => `/guilds/${guildID}/integrations/${integrationID}`,
  GUILD_INTEGRATION_SYNC: (
    { guildID, integrationID }: { guildID: string; integrationID: string },
  ) => `/guilds/${guildID}/integrations/${integrationID}/sync`,
  GUILD_WIDGET: (guildID: string) => `/guilds/${guildID}/widget`,
  GUILD_WIDGET_IMAGE: (guildID: string) => `/guilds/${guildID}/widget.png`,
  GUILD_VANITY_URL: (guildID: string) => `/guilds/${guildID}/vanity-url`,
  GUILD_WEBHOOKS: (guildID: string) => `/guilds/${guildID}/webhooks`,

  CHANNEL: (channelID: string) => `/channels/${channelID}`,
  CHANNEL_MESSAGES: (channelID: string) => `/channels/${channelID}/messages`,
  CHANNEL_MESSAGE: (
    { channelID, messageID }: { channelID: string; messageID: string },
  ) => `/channels/${channelID}/messages/${messageID}`,
  CHANNEL_MESSAGE_BULK_DELETE: (channelID: string) =>
    `/channels/${channelID}/messages/bulk-delete`,
  CHANNEL_MESSAGE_REACTION: (
    { channelID, messageID, emoji }: {
      channelID: string;
      messageID: string;
      emoji: string;
    },
  ) => `/channels/${channelID}/messages/${messageID}/reactions/${emoji}`,
  CHANNEL_MESSAGE_REACTION_ME: (
    { channelID, messageID, emoji }: {
      channelID: string;
      messageID: string;
      emoji: string;
    },
  ) => `/channels/${channelID}/messages/${messageID}/reactions/${emoji}/@me`,
  CHANNEL_MESSAGE_REACTION_USER: (
    { channelID, messageID, emoji, userID }: {
      channelID: string;
      messageID: string;
      emoji: string;
      userID: string;
    },
  ) =>
    `/channels/${channelID}/messages/${messageID}/reactions/${emoji}/${userID}`,
  CHANNEL_MESSAGE_REACTION_ALL: (
    { channelID, messageID }: {
      channelID: string;
      messageID: string;
    },
  ) => `/channels/${channelID}/${messageID}/reactions`,
  CHANNEL_PERMISSIONS: (
    { channelID, overwriteID }: { channelID: string; overwriteID: string },
  ) => `/channels/${channelID}/permissions/${overwriteID}`,
  CHANNEL_INVITES: (channelID: string) => `/channels/${channelID}/invites`,
  CHANNEL_TYPING: (channelID: string) => `/channels/${channelID}/typing`,
  CHANNEL_PINNED: (channelID: string) => `/channels/${channelID}/pins`,
  CHANNEL_PINNED_MESSAGE: (
    { channelID, messageID }: { channelID: string; messageID: string },
  ) => `/channels/${channelID}/pins/${messageID}`,
  CHANNEL_DM_RECIPIENT: (
    { channelID, userID }: { channelID: string; userID: string },
  ) => `/channels/${channelID}/recipients/${userID}`,
  CHANNEL_WEBHOOKS: (channelID: string) => `/channels/${channelID}/webhooks`,

  INVITE: (inviteCode: string) => `/invites/${inviteCode}`,

  USER_ME: "/users/@me",
  USER_ME_DM: "/users/@me/channels",
  USER_ME_GUILD: (guildID: string) => `/users/@me/guilds/${guildID}`,
  USER: (userID: string) => `/users/${userID}`,

  VOICE_REGIONS: "/voice/regions",

  WEBHOOK: (webhookID: string) => `/webhooks/${webhookID}`,
  WEBHOOK_WITH_TOKEN: (
    { webhookID, webhookToken }: { webhookID: string; webhookToken: string },
  ) => `/webhooks/${webhookID}/${webhookToken}`,
  WEBHOOK_COMPATIBLE_SLACK: (
    { webhookID, webhookToken }: { webhookID: string; webhookToken: string },
  ) => `/webhooks/${webhookID}/${webhookToken}/slack`,
  WEBHOOK_COMPATIBLE_GITHUB: (
    { webhookID, webhookToken }: { webhookID: string; webhookToken: string },
  ) => `/webhooks/${webhookID}/${webhookToken}/github`,

  GATEWAY_BOT: "/gateway/bot",
};
