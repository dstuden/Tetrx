import { RouterInstance } from "../utils/RouteUtils";
import * as homeRoute from "./HomeRoute";
import * as playRoute from "./PlayRoute";
import * as leaderboardRoute from "./LeaderboardRoute";
import * as settingsroute from "./SettingsRoute";

export const loadRoutes = () => {
  RouterInstance.routes = {
    home: {
      name: "home",
      template: homeRoute.template,
      init: homeRoute.init,
      clear: homeRoute.clear,
    },
    play: {
      name: "play",
      template: playRoute.template,
      init: playRoute.init,
      clear: playRoute.clear,
    },
    leaderboard: {
      name: "leaderboard",
      template: leaderboardRoute.template,
      init: leaderboardRoute.init,
      clear: leaderboardRoute.clear,
    },
    settings: {
      name: "settings",
      template: settingsroute.template,
      init: settingsroute.init,
      clear: settingsroute.clear,
    },
  };
};
