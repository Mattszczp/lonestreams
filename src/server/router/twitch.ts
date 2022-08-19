import { createRouter } from "./context";
import { getLonelyStreams, getTwitchCategories } from "../../utils/twitch";
import { z } from "zod";

export const twitchRouter = createRouter()
  .query("categories", {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    resolve({ input }) {
      return getTwitchCategories(input.limit, input.cursor);
    },
  })
  .query("streams", {
    input: z.object({
      category: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    }),
    resolve({ input }) {
      return getLonelyStreams(input.category, input.limit, input.cursor);
    },
  });
