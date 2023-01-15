import {
  Config,
  eraseConfig,
  getConfig,
  saveConfig,
} from "../utils/ConfigUtils";
import { clickSound } from "../utils/SoundManager";
import { initThemeSwitcher } from "../utils/ThemeSwitcher";

let config: Config;

const recording = {
  action: "",
  key: "",
  el: undefined,
};

const recorder = (evt: KeyboardEvent) => {
  if (!recording.el) return;

  recording.key = evt.key;
  (recording.el as HTMLElement).innerHTML =
    recording.key === " " ? "Space" : recording.key;
  recording.el = undefined;

  (config.keys as any)[recording.action] = recording.key;
};

export const template = () => {
  return `
      <h2>Settings</h2>
      <div class="keybinds group">
        <h3>Keybinds</h3>
        <div>
          <div class="action">Rotate CW</div><button class="record" action="rCW">${
            getConfig().keys.rCW
          }</button>
        </div>
        <div>
          <div class="action">Rotate CCW</div><button class="record" action="rCCW">${
            getConfig().keys.rCCW
          }</button>
        </div>
        <div>
          <div class="action">Left</div><button class="record" action="left">${
            getConfig().keys.left
          }</button>
        </div>
        <div>
          <div class="action">Right</div><button class="record" action="right">${
            getConfig().keys.right
          }</button>
        </div>
        <div>
          <div class="action">Down</div><button class="record" action="down">${
            getConfig().keys.down
          }</button>
        </div>
        <div>
          <div class="action">Hard Drop</div><button class="record" action="hardDrop">${
            getConfig().keys.hardDrop === " "
              ? "Space"
              : getConfig().keys.hardDrop
          }</button>
        </div>
      </div>
      <div class="personalization group">
        <h3>Personalization</h3>
        <div>
          <div>Background url</div><input id="bacgkroundInput" />
        </div>
        <div>
          <div>Theme</div><button id="themeSwitcher"></button>
        </div>
      </div>
      <div class="sound group">
        <h3>Sound</h3>
        <div>
          <div>Music</div><input id="music-volume" type="range" min="1" max="100" value="${
            getConfig().sound.music * 100
          }" />
          <div>Interact</div><input id="interact-volume" type="range" min="1" max="100" value="${
            getConfig().sound.interact * 100
          }" />
        </div>
      </div>
      <div class="dev group">
        <h3>Manage</h3>
        <button class="erase-config" id="erase-config">Clear config</button>
      </div>
      <button id="save-config">Save</button>
`;
};

export const init = () => {
  config = { ...getConfig() };

  initThemeSwitcher(
    document.querySelector<HTMLButtonElement>(
      "#themeSwitcher"
    ) as HTMLButtonElement
  );

  const keybindButtons = document.getElementsByClassName("record");
  (Array.from(keybindButtons) as HTMLElement[]).forEach((el) => {
    el.onclick = () => {
      recording.action = el.getAttribute("action") as string;
      recording.el = el as any;
    };
  });

  document.addEventListener("keydown", recorder);

  document.querySelector<HTMLButtonElement>("#erase-config")!.onclick = () => {
    eraseConfig();
  };

  document.querySelector<HTMLButtonElement>("#save-config")!.onclick = () => {
    config.personalization.background =
      document.querySelector<HTMLInputElement>("#bacgkroundInput")!.value
        .length > 0
        ? document.querySelector<HTMLInputElement>("#bacgkroundInput")!.value
        : config.personalization.background;

    const musicVolume =
      document.querySelector<HTMLInputElement>("#music-volume")?.value ?? 20;
    const interactVolume =
      document.querySelector<HTMLInputElement>("#interact-volume")?.value ?? 30;

    config.sound.music = parseInt(musicVolume as any) / 100;
    config.sound.interact = parseInt(interactVolume as any) / 100;

    clickSound.volume(config.sound.interact);
    window.postMessage({
      type: "LOBBY_MUSIC_VOLUME",
    });

    saveConfig(config);
  };
};

export const clear = () => {
  document.removeEventListener("keydown", recorder);
};
