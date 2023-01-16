import { Howl } from "howler";
import { getConfig } from "./ConfigUtils";

export const clickSound = new Howl({
  src: ["https://s3.eu-central-1.wasabisys.com/school-random/click.opus"],
});
clickSound.rate(1.4);
clickSound.volume(getConfig().sound.interact);

export const moveSound = new Howl({
  src: ["https://s3.eu-central-1.wasabisys.com/school-random/move.mp3"],
});

moveSound.rate(1.4);
moveSound.volume(getConfig().sound.interact);

export const library = [
  "https://s3.eu-central-1.wasabisys.com/school-random/unravel.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Nana_Kitade.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/LOST_IN_PARADISE.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Little_Dark_Age.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Komm'susser_Tod.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/edamame.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Centimeter.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Buddy_Holly.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/bag_or_die.mp3",
  "https://s3.eu-central-1.wasabisys.com/school-random/Welcome_to_the_Internet.opus",
];

export const backgroundMusic = (): string[] => {
  function shuffle(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  return shuffle(library);
};

export let playlist: Howl;
export const autoplay = (i: number, arr: any[], volume: number) => {
  playlist = new Howl({
    src: [arr[i]],
    preload: true,
    html5: true,
    volume,
    onend: () => {
      if (i + 1 == arr.length) {
        autoplay(0, arr, volume);
      } else {
        autoplay(i + 1, arr, volume);
      }
    },
  });
  setTimeout(() => {
    playlist.play();
  }, 1000);
  playlist.fade(0, volume, 1000);
};
