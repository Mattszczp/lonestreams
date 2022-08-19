import type { HelixStream } from "@twurple/api";
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
    limit: limit ? limit : 45,
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

export const getLonelyStreams = async (
  categoryName: string,
  limit: number,
  cursor?: string | null
) => {
  const client = createTwitchApiClient();
  const category = await client.games.getGameByName(categoryName);
  let streams: HelixStream[] = [];

  while (streams.length === 0) {
    const res = await client.streams.getStreams({
      game: category?.id,
      type: "live",
      limit: limit ? limit : 45,
      after: cursor ? cursor : undefined,
    });

    const border = res.data.findIndex((r) => r.viewers < 50);
    streams = res.data.slice(border, res.data.length - 1);
    cursor = res.cursor;
  }
  if (streams.length < limit) {
    const res = await client.streams.getStreams({
      game: category?.id,
      type: "live",
      limit: limit ? limit : 45,
      after: cursor ? cursor : undefined,
    });
    streams.push(...res.data);
    cursor = res.cursor;
  }

  return {
    nextCursor: cursor,
    streams: streams.map((stream) => {
      return {
        id: stream.id,
        name: stream.userDisplayName,
        viewers: stream.viewers,
        thumbnailUrl: stream.getThumbnailUrl(440, 248),
      };
    }),
  };
};
