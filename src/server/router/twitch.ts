import { createRouter } from "./context";
import { getLonelyStreams, getTwitchCategories } from "../../utils/twitch";

export const twitchRouter = createRouter().query("categories", {
  resolve() {
    return getTwitchCategories();
  },
});
