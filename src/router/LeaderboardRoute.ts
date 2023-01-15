import { getLeaderboard } from "../utils/LeaderboardUtils";

export interface Score {
  user: string;
  score: number;
}

export const template = () => {
  return `
     <h2>Leaderboard</h2>
     <table id="scoreboard"></table>
`;
};

export const init = () => {
  const table = document.querySelector<HTMLTableElement>("#scoreboard");
  table!.innerHTML = `
      <tr class="head">
        <th class="user">Player</th>
        <th class="score">Score</th>
      </tr>
  `;

  const leaderboard = getLeaderboard().sort((a, b) => {
    return b.score - a.score;
  });

  leaderboard.forEach((el) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="user">${el.playerName}</td>
      <td class="score">${el.score}</td>
    `;

    table?.append(row);
  });
};

export const clear = () => {};
