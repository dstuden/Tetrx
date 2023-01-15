import { RouterInstance } from "../utils/RouteUtils";

export const template = () => {
  return `
      <h1>Tetrx</h1>
      <router>
        <button class="link" path="play">Play</button>
        <button class="link" path="leaderboard">Leaderboard</button>
        <button class="link" path="settings">Settings</button>
      </router>
`;
};

export const init = () => {
  [...(document.querySelector("router")?.children as any)].forEach(
    (el: Element) => {
      el.addEventListener("click", () => {
        RouterInstance.goTo(el.getAttribute("path") as string);
      });
    }
  );
};

export const clear = () => {};
