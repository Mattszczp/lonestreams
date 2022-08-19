import { ApiClient } from "@twurple/api";
import { ClientCredentialsAuthProvider } from "@twurple/auth";
import { env } from "../env/server.mjs";

const createTwitchApiClient = () => {
  const authProvider = new ClientCredentialsAuthProvider(
    env.TWITCH_CLIENT_ID,
    env.TWITCH_CLIENT_SECRET
  );
  return new ApiClient({ authProvider });
};

export const getTwitchCategories = async (
  limit?: number | null,
  cursor?: string | null
) => {
  const client = createTwitchApiClient();
  const res = await client.games.getTopGames({
    limit: limit ? limit : 50,
    after: cursor ? cursor : undefined,
  });

  return {
    categories: res.data.map((game) => {
      return {
        id: game.id,
        name: game.name,
        coverArtUrl: game.getBoxArtUrl(285, 380),
      };
    }),
    nextCursor: res.cursor,
  };
};

export const getLonelyStreams = async (categoryName: string) => {
  const client = createTwitchApiClient();
  const category = await client.games.getGameByName(categoryName);
  const res = await client.streams.getStreams({
    game: category?.id,
    type: "live",
    limit: 100,
  });

  const border = res.data.findIndex((r) => r.viewers < 50);
  const streams = res.data.slice(border, res.data.length - 1);

  return streams.map((stream) => {
    return {
      id: stream.id,
      name: stream.userDisplayName,
      viewers: stream.viewers,
      thumbnailUrl: stream.getThumbnailUrl(440, 248),
    };
  });
};
