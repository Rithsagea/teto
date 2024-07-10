import { addExtension, Unpackr } from "msgpackr";

addExtension({
  type: 1,
  read: (e) => (null === e ? { success: !0 } : { success: !0, ...e }),
});
addExtension({
  type: 2,
  read: (e) => (null === e ? { success: !1 } : { success: !1, error: e }),
});

export const unpacker = new Unpackr({ bundleStrings: true, sequential: true });

function debug(...args: any[]) {
  // console.log(...args);
}

export namespace Tetrio {
  export async function getApi(endpoint: string) {
    await Bun.sleep(1000);
    debug(`API Fetch: ${endpoint}`);
    const response = await fetch(`https://ch.tetr.io/api${endpoint}`);
    return (await response.json()).data;
  }

  export async function getTetrio(endpoint: string) {
    await Bun.sleep(1000);
    debug(`Tetrio Fetch: ${endpoint}`);
    const response = await fetch(`https://tetr.io/api${endpoint}`, {
      headers: {
        Accept: "application/vnd.osk.theorypack",
        Authorization: `Bearer ${process.env.TETO_TOKEN}`,
      },
    });
    const data = unpacker.unpack(Buffer.from(await response.arrayBuffer()));

    return data;
  }

  export async function getTopUsers() {
    return (await getApi("/users/lists/league?limit=100")).users;
  }

  export async function getStream(stream: string) {
    return getApi(`/streams/${stream}`);
  }

  export async function getUserRecentReplays(userId: string) {
    return (await getStream(`league_userrecent_${userId}`)).records;
  }

  export async function getReplay(replayId: string) {
    return (await getTetrio(`/games/${replayId}`)).game;
  }
}
