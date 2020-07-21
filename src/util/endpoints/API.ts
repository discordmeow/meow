export const ApiEndpoints = {
  GUILD_AUDIT_LOG: (guildID: string) => `/guilds/${guildID}/audit-logs`,
  CHANNEL: (channelID: string) => `/channels/${channelID}`,
  CHANNEL_MESSAGES: (channelID: string) => `/channels/${channelID}/messages`,
  CHANNEL_MESSAGE: (channelID: string, messageID: string) =>
    `/channels/${channelID}/messages/${messageID}`,
};
