import { createRouter } from "./context";
import { getLonelyStreams, getTwitchCategories } from "../../utils/twitch";
import { z } from "zod";

export const twitchRouter = createRouter()
  .query("categories", {
    resolve() {
      return getTwitchCategories();
    },
  })
  .query("streams", {
    input: z.string(),
    resolve({ input }) {
      return getLonelyStreams(input);
    },
  });
