import process from "node:process";
import {
  getActivePlayersMap,
  getEvents,
  getPlayerHistory,
  getTeams,
} from "./clients/cache.ts";
import type { ActivePlayersMap } from "./types/index.ts";
import { filterByTeam, getSeasonLabel } from "./lib/index.ts";
import { writeFile } from "node:fs/promises";

const [_0, _1, ...params] = process.argv;

const [teamInput, lastXInput, ..._rest] = params;

const lastXGames = Number(lastXInput) || 6;

const teams = await getTeams();
const activePlayersCacheValue = await getActivePlayersMap();
const activePlayersMap: ActivePlayersMap = { ...activePlayersCacheValue };

for (const key of Object.keys(activePlayersMap)) {
  const { history = [] } = await getPlayerHistory(key);
  // activePlayersMap[key].history = [...cachedValue.history];
  const lastX = history
    .reverse()
    .slice(0, lastXGames)
    .map((event) => {
      const opponent_team_name = teams.find(
        ({ id }) => event.opponent_team === id,
      ).short_name;
      return { ...event, opponent_team_name };
    });
  const xG = lastX
    .reduce((acc, { expected_goals }) => {
      acc = acc + +expected_goals;
      return acc;
    }, 0)
    .toFixed(2);
  const xA = lastX
    .reduce((acc, { expected_assists }) => {
      acc = acc + +expected_assists;
      return acc;
    }, 0)
    .toFixed(2);
  const xGi = lastX
    .reduce((acc, { expected_goal_involvements }) => {
      acc = acc + +expected_goal_involvements;
      return acc;
    }, 0)
    .toFixed(2);
  const xGc = lastX
    .reduce((acc, { expected_goals_conceded }) => {
      acc = acc + +expected_goals_conceded;
      return acc;
    }, 0)
    .toFixed(2);
  const bps = lastX
    .reduce((acc, { bps }) => {
      acc = acc + +bps;
      return acc;
    }, 0)
    .toFixed(2);
  const defCon = lastX.reduce((acc, { defensive_contribution }) => {
    acc = acc + +defensive_contribution;
    return acc;
  }, 0);
  const starts = lastX
    .reduce((acc, { starts }) => {
      acc = acc + +starts;
      return acc;
    }, 0)
    .toFixed(2);

  activePlayersMap[key].starts = Number(starts);
  activePlayersMap[key].xG = Number(xG);
  activePlayersMap[key].xA = Number(xA);
  activePlayersMap[key].xGi = Number(xGi);
  activePlayersMap[key].xGc = Number(xGc);
  activePlayersMap[key].bps = Number(bps);
  activePlayersMap[key].defCon = Number(defCon);
}

const topFwdXGi = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team }) => position === "FWD" && filterByTeam(teamInput, team),
  )
  .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);

const topMidXGi = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team }) => position === "MID" && filterByTeam(teamInput, team),
  )
  .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);

const topMidDefCon = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team }) => position === "MID" && filterByTeam(teamInput, team),
  )
  .sort(({ defCon: aDefCon }, { defCon: bDefCon }) => bDefCon - aDefCon);

const topDefXGi = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team }) => position === "DEF" && filterByTeam(teamInput, team),
  )
  .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);

const topDefDefCon = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team }) => position === "DEF" && filterByTeam(teamInput, team),
  )
  .sort(({ defCon: aDefCon }, { defCon: bDefCon }) => bDefCon - aDefCon);

const topDefXGc = Object.keys(activePlayersMap)
  .map((key) => activePlayersMap[key])
  .filter(
    ({ position, team, xGc, starts }) =>
      position === "DEF" &&
      filterByTeam(teamInput, team) &&
      +xGc !== 0 &&
      starts > 1,
  )
  .sort(({ xGc: axGc }, { xGc: bxGc }) => axGc - bxGc);

const events = await getEvents();
const gwNumber = events.find(({ is_next }) => is_next).id;
const seasonLabel = getSeasonLabel(events);

await writeFile(
  `./${seasonLabel}/gw_${gwNumber}_last_${lastXGames}${
    teamInput ? `_${teamInput}` : ""
  }.json`,
  JSON.stringify({
    title: `Player stats for their own last ${lastXGames} games`,
    gw: gwNumber,
    active_players: Object.keys(activePlayersMap).length,
    top_fwd_xgi: topFwdXGi.slice(0, 20),
    top_mid_xgi: topMidXGi.slice(0, 20),
    top_mid_defcon: topMidDefCon.slice(0, 20),
    top_def_xgc: topDefXGc.slice(0, 20),
    top_def_xgi: topDefXGi.slice(0, 20),
    top_def_defcon: topDefDefCon.slice(0, 20),
  }),
);

process.exit(0);
