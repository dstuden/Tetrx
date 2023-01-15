import { TetrominoName } from "./TetrominoLogicUtils";
import { Tetrominos } from "./Tetrominos";
import { Tetromino, getSprite } from "./TetrominoLogicUtils";
import { autoplay, backgroundMusic, playlist } from "./SoundManager";
import { getConfig } from "./ConfigUtils";
import { pushToLeaderboard } from "./LeaderboardUtils";

const scores = {
  1: 40,
  2: 100,
  3: 300,
  4: 1200,
};

export class Game {
  private activeTetromino: Tetromino | null = null;
  private nextTetromino: TetrominoName | string = "";
  private mainBoard: number[][] = [];
  private mainCanvas: HTMLCanvasElement | null = null;
  private mainCtx: CanvasRenderingContext2D | null = null;
  private nextBoard: number[][] = [];
  private nextCanvas: HTMLCanvasElement | null = null;
  private nextCtx: CanvasRenderingContext2D | null = null;

  private score = 0;
  private isActive = false;

  private blockSize = 48;
  private blockImg: HTMLImageElement | null = null;
  private fallRate = 60; // fall-rate for 1st level
  private fallK = 0.793167435885;
  private ticks = 0;
  private level = 1;
  private linesCleared = 0;

  public playerName = "";

  private oldTime = Date.now();

  private possibleTetrominos: TetrominoName[] = Object.keys(Tetrominos) as any;

  private getNewTetromino() {
    let tetromino: TetrominoName;
    do {
      tetromino =
        this.possibleTetrominos[
          Math.floor(Math.random() * this.possibleTetrominos.length)
        ];
    } while (tetromino === this.activeTetromino?.name);
    return tetromino;
  }

  private drawBlock = (
    row: number,
    col: number,
    ctx: CanvasRenderingContext2D,
    board: number[][]
  ) => {
    ctx.drawImage(
      this.blockImg!,
      board[row][col]! * this.blockSize,
      0,
      this.blockSize,
      this.blockSize,
      col * this.blockSize,
      row * this.blockSize,
      this.blockSize,
      this.blockSize
    );
  };

  private getNextTetromino = () => {
    this.nextTetromino = this.getNewTetromino();

    const matrix = Tetrominos[
      this.nextTetromino as TetrominoName
    ].states[0].map((row) => {
      return row.map((col) => {
        if (col) return getSprite(this.nextTetromino as TetrominoName);
        return 0;
      });
    });

    for (let row = 0; row < this.nextBoard.length; row++) {
      for (let col = 0; col < this.nextBoard[row].length; col++) {
        if (matrix[row] && matrix[row][col])
          this.nextBoard[row][col] = matrix[row][col];
        else this.nextBoard[row][col] = 0;
      }
    }
  };

  private loop() {
    const newTime = Date.now();
    if ((newTime - this.oldTime) * 1_000_000 >= 16667) {
      this.update();
      this.render();
      this.oldTime = newTime;
    }

    if (this.isActive) requestAnimationFrame(this.loop.bind(this));
  }

  start = () => {
    this.isActive = true;
    autoplay(0, backgroundMusic(), getConfig().sound.music);
    requestAnimationFrame(this.loop.bind(this));
  };

  stop = () => {
    this.isActive = false;
    setTimeout(() => {
      playlist?.stop();
    }, 1000);
    playlist?.fade(getConfig().sound.music, 0, 1000);
  };

  private update = () => {
    this.activeTetromino!.update();
    for (let row = 0; row < this.activeTetromino!.matrix.length; row++) {
      for (let col = 0; col < this.activeTetromino!.matrix[row].length; col++) {
        if (this.activeTetromino!.matrix[row][col]) {
          this.mainBoard[this.activeTetromino!.position.y + row][
            this.activeTetromino!.position.x + col
          ] = this.activeTetromino!.sprite;
        }
      }
    }

    let rowsCleared = 0;
    this.mainBoard.forEach((row, index) => {
      if (!row.includes(0) && !this.activeTetromino?.falling) {
        rowsCleared++;
        this.mainBoard.splice(index, 1);
        this.mainBoard.unshift(new Array(10).fill(0));
      }
    });

    this.linesCleared += rowsCleared;

    if (rowsCleared > 0) {
      // @ts-ignore
      this.score += scores[rowsCleared] * this.level;
    }

    if (!this.activeTetromino?.falling) {
      this.activeTetromino = new Tetromino(
        this.nextTetromino as TetrominoName,
        {
          board: this.mainBoard,
          fallRate: this.fallRate,
        }
      );
      this.getNextTetromino();
    }

    if (this.linesCleared > 39) {
      this.level++;
      this.linesCleared = 0;
      this.fallRate = this.fallRate * this.fallK;
    }

    this.setScore();
    this.ticks++;
  };

  private render = () => {
    for (let row = 0; row < this.mainBoard.length; row++) {
      for (let col = 0; col < this.mainBoard[row].length; col++) {
        this.drawBlock(row, col, this.mainCtx!, this.mainBoard);
      }
    }

    for (let row = 0; row < this.nextBoard.length; row++) {
      for (let col = 0; col < this.nextBoard[row].length; col++) {
        this.drawBlock(row, col, this.nextCtx!, this.nextBoard);
      }
    }
  };

  constructor() {
    this.mainCanvas = document.querySelector("#canvas");
    this.mainCtx = this.mainCanvas!.getContext("2d") as any;
    this.mainCanvas!.width = this.blockSize * 10;
    this.mainCanvas!.height = this.blockSize * 21;
    this.mainCtx!.strokeStyle = "#dbdcdc";
    this.mainBoard = Array.from(
      {
        length: 21,
      },
      () => new Array(10).fill(0)
    );

    this.nextCanvas = document.querySelector("#canvas-next");
    this.nextCtx = this.nextCanvas!.getContext("2d") as any;
    this.nextCanvas!.width = this.blockSize * 4;
    this.nextCanvas!.height = this.blockSize * 4;
    this.nextCtx!.strokeStyle = "#dbdcdc";
    this.nextBoard = Array.from(
      {
        length: 4,
      },
      () => new Array(4).fill(0)
    );

    this.blockImg = new Image(this.blockSize, this.blockSize);
    this.blockImg.src = "/tetrominos.webp";
    this.fallRate = 60;

    window.addEventListener("message", (evt: MessageEvent) => {
      if (evt.data.type === "GAME_OVER") {
        if (this.isActive) {
          pushToLeaderboard({
            playerName: this.playerName,
            score: this.score,
          });
          document.getElementById("1p")!.innerHTML = "Retry";
          (document.getElementsByClassName("menu")[0] as any).style.display =
            "flex";
          (document.getElementById("game") as any).style.display = "none";
          (document.getElementById("player-name") as any).style.display =
            "none";
          document.getElementById("game-over")!.style.display = "unset";
          this.stop();
        }
      }
    });

    this.activeTetromino = new Tetromino(this.getNewTetromino(), {
      board: this.mainBoard,
      fallRate: this.fallRate,
    });
    this.getNextTetromino();
  }

  private setScore = () => {
    document.getElementById("time")!.innerHTML = ((): string => {
      const secs = this.ticks / 60;
      const date = new Date(secs * 1000);

      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const seconds = date.getSeconds();

      const timeString =
        hours.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0") +
        ":" +
        seconds.toString().padStart(2, "0");

      return timeString;
    })();

    document.getElementById("points")!.innerHTML = ((): string => {
      return this.score.toString();
    })();
  };
}
