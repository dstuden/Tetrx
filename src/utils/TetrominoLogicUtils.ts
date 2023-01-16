import { getConfig } from "./ConfigUtils";
import { clickSound, moveSound } from "./SoundManager";
import { Tetrominos } from "./Tetrominos";

// returns sprite position on spritesheet
export const getSprite = (tetrominoName: TetrominoName): number => {
  switch (tetrominoName) {
    case "O":
      return 1;
      break;
    case "I":
      return 2;
      break;
    case "L":
      return 3;
      break;
    case "J":
      return 4;
      break;
    case "S":
      return 5;
      break;
    case "Z":
      return 6;
      break;
    case "T":
      return 7;
      break;
    default:
      return 0;
  }
};

export type TetrominoName = "I" | "O" | "T" | "L" | "J" | "S" | "Z";

export type TetrominoMatrix = boolean[][][];

export class Tetromino {
  private static idGen = 0;

  public id: number;
  public name: string;

  private states: TetrominoMatrix;

  public sprite: number;
  public falling = true;
  public rotating = false;

  public currentState = 0;
  private newState = 0;
  private fallRate = 0;

  public position = {
    x: 0,
    y: 0,
  };

  private newPosition = {
    x: 0,
    y: 0,
  };

  private ticksSinceYUpdate = 0;

  private board: number[][];
  private keyEvent!: KeyboardEvent;
  //@ts-ignore
  private justSpawned: boolean;

  constructor(
    type: TetrominoName,
    data: { board: number[][]; fallRate: number }
  ) {
    this.states = (Tetrominos[type] as any).states;
    this.name = type;
    this.sprite = getSprite(type);
    this.id = Tetromino.idGen++;
    this.board = data.board;
    this.fallRate = data.fallRate;
    this.justSpawned = true;
    this.newPosition = {
      x: 3,
      y: 0,
    };
    if (this.collides(this.newState, this.newPosition)) {
      this.falling = false;
      window.postMessage({
        type: "GAME_OVER",
      });
    }

    window.addEventListener("keydown", (evt) => (this.keyEvent = evt));
  }

  get matrix() {
    return this.states[this.currentState];
  }

  private rotate(direction: "left" | "right") {
    this.rotating = true;

    this.newState = this.currentState;
    if (direction === "right") {
      this.newState++;
      if (this.newState >= this.states.length) {
        this.newState = 0;
      }
    } else {
      this.newState--;
      if (this.newState < 0) {
        this.newState = this.states.length - 1;
      }
    }

    if (this.collides(this.newState, this.newPosition)) {
      this.newState = this.currentState;
    }

    this.rotating = false;
  }

  private collides(newState: number, newPosition: { x: number; y: number }) {
    const matrix = this.states[newState];
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        // Only check for collision if the current block is not empty
        if (matrix[row][col]) {
          // Check if out of bounds
          if (
            newPosition.x + col >= this.board[0].length ||
            newPosition.x + col < 0
          ) {
            document.getElementById("canvas")?.classList.add("shake-x");
            setTimeout(() => {
              document.getElementById("canvas")?.classList.remove("shake-x");
            }, 300);
            return true;
          }

          if (newPosition.y + row >= this.board.length) {
            this.falling = false;
            return true;
          }
          // Check for collision with other blocks
          if (this.board[newPosition.y + row][newPosition.x + col] !== 0) {
            // Stops falling if it collides with another block when falling
            if (
              this.newPosition.y >= this.position.y &&
              this.newPosition.x === this.position.x &&
              !this.rotating
            ) {
              this.falling = false;
              clickSound.play();
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  private hardDrop() {
    let y = this.newPosition.y;

    while (!this.collides(this.currentState, { x: this.newPosition.x, y })) {
      y++;
    }
    y--;

    this.newPosition.y = y;
    document.getElementById("canvas")?.classList.add("shake-y");
    setTimeout(() => {
      document.getElementById("canvas")?.classList.remove("shake-y");
    }, 300);
    clickSound.play();
  }

  private handleInput(evt: KeyboardEvent) {
    switch (evt?.key) {
      case getConfig().keys.down:
        this.newPosition.y++;
        if (this.collides(this.newState, this.newPosition))
          this.newPosition.y--;
        break;
      case getConfig().keys.rCW:
        this.rotate("right");
        break;
      case getConfig().keys.rCCW:
        this.rotate("left");
        break;
      case getConfig().keys.hardDrop:
        this.hardDrop();
        break;
      case getConfig().keys.left:
        this.newPosition.x--;
        if (this.collides(this.newState, this.newPosition))
          this.newPosition.x++;
        else moveSound.play();
        break;
      case getConfig().keys.right:
        this.newPosition.x++;
        if (this.collides(this.newState, this.newPosition))
          this.newPosition.x--;
        else moveSound.play();
        break;
      default:
        break;
    }

    this.keyEvent = null as any;
  }

  update() {
    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        if (this.matrix[row][col]) {
          this.board[this.position.y + row][this.position.x + col] = 0;
        }
      }
    }

    if (!this.falling) {
      return;
    }
    this.handleInput(this.keyEvent as KeyboardEvent);

    if (this.ticksSinceYUpdate >= this.fallRate) {
      this.newPosition.y++;
      if (this.collides(this.newState, this.newPosition)) this.newPosition.y--;
      this.ticksSinceYUpdate = 0;
      this.justSpawned = false;
    }

    this.position = { ...this.newPosition };
    this.currentState = this.newState;

    this.ticksSinceYUpdate++;
  }
}
