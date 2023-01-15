export interface Config {
  keys: {
    rCW: string;
    rCCW: string;
    left: string;
    right: string;
    down: string;
    hardDrop: string; // space,
    pause: string;
  };
  personalization: {
    background: string; // image url,
    theme: "dark" | "light";
  };
  sound: {
    music: number;
    interact: number;
  };
}

let config: Config;

export const loadConfig = () => {
  if (localStorage.getItem("config"))
    config = JSON.parse(localStorage.getItem("config")!);
  else
    config = {
      keys: {
        rCW: "ArrowUp",
        rCCW: "Control",
        left: "ArrowLeft",
        right: "ArrowRight",
        down: "ArrowDown",
        hardDrop: " ",
        pause: "Escape",
      },
      personalization: {
        background: "",
        theme: "dark",
      },
      sound: {
        music: 0.02,
        interact: 0.03,
      },
    };
};

export const getConfig = (): Config => {
  return config;
};

export const saveConfig = (conf: Config) => {
  config = { ...conf };
  localStorage.setItem("config", JSON.stringify(conf));
};

export const eraseConfig = () => {
  localStorage.removeItem("config");
  loadConfig();
};

loadConfig();
