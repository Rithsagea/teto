const indexFile = Bun.file("./data/index.json");
let games: Record<string, any>;

export namespace Database {
  export async function loadIndex() {
    if (!(await indexFile.exists())) {
      games = {};
    } else {
      games = await indexFile.json();
    }
  }

  export async function saveIndex() {
    await Bun.write(indexFile, JSON.stringify(games));
  }

  export async function addGame(game: any) {
    await Bun.write(`./data/${game._id}.ttrm`, JSON.stringify(game));
    games[game._id] = game.endcontext;
    await saveIndex();
  }

  export function isGameSaved(id: string) {
    return !!games[id];
  }
}
