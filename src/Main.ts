import { Database } from "./Database";
import { Tetrio } from "./Tetrio";

const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "long",
});

async function updateGame(game: any) {
  const replayId = game.replayid;
  const [p1, p2] = game.endcontext;
  const desc = `${dateTimeFormat.format(new Date(game.ts))} - ${p1.username} (${p1.wins}) vs ${p2.username} (${p2.wins})`;

  if (!Database.isGameSaved(replayId)) {
    console.log(`[o] ${desc}`);
    const data = await Tetrio.getReplay(replayId);
    await Database.addGame(data);
  } else {
    console.log(`[x] ${desc}`);
  }
}

async function updateLeaderboard() {
  const users = await Tetrio.getTopUsers();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const { _id: userId, username } = user;
    console.log(`#${i + 1} - ${username} (${userId})`);

    const recentGames: any[] = await Tetrio.getUserRecentReplays(userId);
    for (const game of recentGames) {
      await updateGame(game);
    }
  }
}

await Database.loadIndex();
await updateLeaderboard();
await Database.saveIndex();
