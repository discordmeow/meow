export const CDNEndpoints = {
  CUSTOM_EMOJI: (emojiID: string) => `/emojis/${emojiID}.png`,

  GUILD_ICON: (
    { guildID, guildIcon }: { guildID: string; guildIcon: string },
  ) => `/icons/${guildID}/${guildIcon}.png`,
  GUILD_SPLASH: (
    { guildID, guildSplash }: { guildID: string; guildSplash: string },
  ) => `/splashes/${guildID}/${guildSplash}.png`,
  GUILD_DISCOVERY_SPLASH: (
    { guildID, guildDiscoverySplash }: {
      guildID: string;
      guildDiscoverySplash: string;
    },
  ) => `/discovery-splashes/${guildID}/${guildDiscoverySplash}.png`,
  GUILD_BANNER: (
    { guildID, guildBanner }: { guildID: string; guildBanner: string },
  ) => `/banners/${guildID}/${guildBanner}.png`,

  USER_DEFAULT_AVATAR: (userDiscriminator: string) =>
    `/embed/avatars/${+userDiscriminator % 5}.png`,
  USER_AVATAR: (
    { userID, userAvatar }: { userID: string; userAvatar: string },
  ) => `/avatars/${userID}/${userAvatar}.png`,
};
