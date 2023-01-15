interface Style {
  base: string[];
  normal: string[];
  warning: string[];
  success: string[];
  error: string[];
}

export enum StyleOption {
  normal = "normal",
  warning = "warning",
  success = "success",
  error = "error",
}

class Logger {
  private style: Style;

  constructor() {
    this.style = {
      base: [
        "padding: 2px 4px",
        "border-radius: 2px",
        "font-size: 12px",
        "font-family: Monospace",
        "font-weight: 500",
      ],
      normal: ["olor: #444"],
      warning: ["color: #F57513"],
      success: ["color: white"],
      error: ["color: red"],
    };
  }

  log(text: string, extra?: StyleOption) {
    let style = this.style.base.join(";") + ";";
    if (extra) {
      style += this.style[extra].join(";") + ";";
    }
    console.log(`%c${text}`, style);
  }
}

export const LoggerInstance = new Logger();
