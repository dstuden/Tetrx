import { getConfig, saveConfig } from "./ConfigUtils";

export const initThemeSwitcher = (element: HTMLButtonElement) => {
  let theme = getConfig().personalization.theme;

  if (theme === "light")
    element.innerHTML = `
      <img src="/sun.svg" class="light" alt="themeIcon"/>
    `;
  else
    element.innerHTML = `
      <img src="/moon.svg" class="dark" alt="themeIcon"/>
    `;

  document.querySelector<HTMLDivElement>("#app")?.classList.add(theme);

  element.addEventListener("click", () => {
    if (theme === "light") {
      theme = "dark";
      element.innerHTML = `
        <img src="/moon.svg" class="dark" alt="themeIcon"/>
      `;
    } else {
      theme = "light";
      element.innerHTML = `
        <img src="/sun.svg" class="light" alt="themeIcon"/>
      `;
    }
    document.querySelector<HTMLDivElement>("#app")?.classList.toggle("light");
    document.querySelector<HTMLDivElement>("#app")?.classList.toggle("dark");

    const config = getConfig();
    config.personalization.theme = theme;
    saveConfig(config);
  });
};
