export const getLeaderboard = () => {
  const rawLeaderboard = localStorage.getItem("leaderboard") ?? "[]";

  const leaderboard: { playerName: string; score: number }[] =
    JSON.parse(rawLeaderboard);
  return leaderboard;
};

export const pushToLeaderboard = (data: {
  playerName: string;
  score: number;
}) => {
  const leaderboard = getLeaderboard();
  leaderboard.push({
    playerName: data.playerName,
    score: data.score,
  });

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
};
