import "./assets/play.less";
import "./assets/home.less";
import "./assets/leaderboard.less";
import "./assets/settings.less";

import { loadRoutes } from "./router/routes";
import { RouterInstance } from "./utils/RouteUtils";
import { clickSound } from "./utils/SoundManager";
import { getConfig } from "./utils/ConfigUtils";
import { Howl } from "howler";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <button class="link home-button" path="home">Home</button>
  <main></main>
`;

document.querySelector<HTMLElement>(".home-button")!.onclick = () => {
  RouterInstance.goTo("home");
};
document.addEventListener("click", () => clickSound.play());

document
  .querySelector("#app")
  ?.classList.toggle(getConfig().personalization.theme);

loadRoutes();
RouterInstance.goTo("home");

const lobbyMusic = new Howl({
  src: ["https://s3.eu-central-1.wasabisys.com/school-random/ずるいね.mp3"],
  loop: true,
  volume: getConfig().sound.music,
});

lobbyMusic.play();
let lobbyMusicPlaying = true;

window.addEventListener("message", (msg: MessageEvent) => {
  if (msg.data.type === "STOP_LOBBY_MUSIC") {
    lobbyMusic.fade(getConfig().sound.music, 0, 1000);
    setTimeout(() => {
      lobbyMusic?.stop();
    }, 1000);
    lobbyMusicPlaying = false;
  }
  if (msg.data.type === "PLAY_LOBBY_MUSIC") {
    if (!lobbyMusicPlaying) {
      lobbyMusic.fade(0, getConfig().sound.music, 1000);
      setTimeout(() => {
        lobbyMusic?.play();
      }, 1000);
      lobbyMusicPlaying = true;
    }
  }
  if (msg.data.type === "LOBBY_MUSIC_VOLUME") {
    lobbyMusic.volume(getConfig().sound.music);
  }
});
