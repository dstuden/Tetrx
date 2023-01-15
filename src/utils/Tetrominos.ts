import { TetrominoName } from "./TetrominoLogicUtils";

type ITetrominos = {
  [key in TetrominoName]: {
    states: boolean[][][];
  };
};

export const Tetrominos: ITetrominos = {
  I: {
    states: [
      [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false],
      ],
      [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
      ],
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
      ],
      [
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
      ],
    ],
  },
  O: {
    states: [
      [
        [true, true],
        [true, true],
      ],
    ],
  },
  L: {
    states: [
      [
        [false, false, true],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, false],
        [false, true, true],
      ],
      [
        [false, false, false],
        [true, true, true],
        [true, false, false],
      ],
      [
        [true, true, false],
        [false, true, false],
        [false, true, false],
      ],
    ],
  },
  J: {
    states: [
      [
        [true, false, false],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, true],
        [false, true, false],
        [false, true, false],
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, false, true],
      ],
      [
        [false, true, false],
        [false, true, false],
        [true, true, false],
      ],
    ],
  },
  S: {
    states: [
      [
        [false, true, true],
        [true, true, false],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, false, true],
      ],
      [
        [false, false, false],
        [false, true, true],
        [true, true, false],
      ],
      [
        [true, false, false],
        [true, true, false],
        [false, true, false],
      ],
    ],
  },
  Z: {
    states: [
      [
        [true, true, false],
        [false, true, true],
        [false, false, false],
      ],
      [
        [false, false, true],
        [false, true, true],
        [false, true, false],
      ],

      [
        [false, false, false],
        [true, true, false],
        [false, true, true],
      ],

      [
        [false, true, false],
        [true, true, false],
        [true, false, false],
      ],
    ],
  },
  T: {
    states: [
      [
        [false, true, false],
        [true, true, true],
        [false, false, false],
      ],
      [
        [false, true, false],
        [false, true, true],
        [false, true, false],
      ],
      [
        [false, false, false],
        [true, true, true],
        [false, true, false],
      ],
      [
        [false, true, false],
        [true, true, false],
        [false, true, false],
      ],
    ],
  },
};
