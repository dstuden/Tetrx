import { getConfig } from "../utils/ConfigUtils";

import { Game } from "../utils/GameLogicUtils";

let player: HTMLInputElement;

export const template = () => {
  return `
  <div id="background"></div>
  <div id="game">
    <div class="stats">
      <h3 id="time"></h2>
      <h3 id="points"></h2>
    </div>
    <canvas id="canvas"></canvas>
    <canvas id="canvas-next"></canvas>
  </div>
  <div class="menu">
    <h2 id="game-over">Game Over</h2>
    <input id="player-name" placeholder="Player name" minlen="1" maxlen="10"/>
    <button id="1p">Start</button>
  </div>
`;
};

let game: Game;

export const init = () => {
  (document.getElementById("game") as any).style.display = "none";

  player = document.querySelector<HTMLInputElement>("#player-name")!;

  document.getElementById("1p")!.onclick = () => {
    if (player.value.length === 0 || player.value.length > 10) return;

    game = new Game();
    game.playerName = player.value;
    (document.getElementsByClassName("menu")[0] as any).style.display = "none";
    (document.getElementById("game") as any).style.display = "flex";
    window.postMessage({
      type: "STOP_LOBBY_MUSIC",
    });
    game.start();
  };

  document.getElementById("game-over")!.style.display = "none";

  document.getElementById("background")!.style.background = `url(${
    getConfig().personalization.background
  })`;
};

export const clear = () => {
  game.stop();
  game = new Game();
  document.getElementById("background")!.style.background = ``;
  window.postMessage({
    type: "PLAY_LOBBY_MUSIC",
  });
};
