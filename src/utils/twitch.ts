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

export const getTwitchCategories = async () => {
  const client = createTwitchApiClient();
  const res = await client.games.getTopGames();

  return res.data.map((game) => {
    return {
      id: game.id,
      name: game.name,
      coverArtUrl: game.getBoxArtUrl(285, 380),
    };
  });
};

export const getLonelyStreams = async (categoryId: string) => {
  const client = createTwitchApiClient();
  const res = await client.streams.getStreams({
    game: categoryId,
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
