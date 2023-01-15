import { LoggerInstance, StyleOption } from "./Logger";

export interface RouteInterface {
  [propName: string]: Route;
}

export interface Route {
  name: string;
  template: any;
  init: any; // callback to setup DOM
  clear: any; // callback to run when changing off route
}

export class RouteManager {
  private avalibleRoutes: RouteInterface;
  private currentRoute: string;

  constructor() {
    this.avalibleRoutes = {};
    this.currentRoute = "";
  }

  set routes(routes: RouteInterface) {
    this.avalibleRoutes = routes;
  }

  get getRoutes() {
    return this.avalibleRoutes;
  }

  goTo(routeName: string) {
    if (!this.avalibleRoutes[routeName]) {
      LoggerInstance.log(
        `No matches for route "${routeName}" were found!`,
        StyleOption.warning
      );

      return;
    }

    if (this.currentRoute === routeName) return;

    if (routeName !== "home")
      document.querySelector<HTMLElement>(".home-button")!.style.display =
        "block";
    else
      document.querySelector<HTMLElement>(".home-button")!.style.display =
        "none";

    this.avalibleRoutes[this.currentRoute]?.clear();

    this.currentRoute = routeName;

    document.querySelector<HTMLDivElement>("main")!.innerHTML =
      this.avalibleRoutes[routeName].template();
    document.querySelector<HTMLDivElement>("main")!.id = routeName;

    this.avalibleRoutes[this.currentRoute].init();
  }
}

export const RouterInstance = new RouteManager();
