import type { Team } from '../types/index.ts';
import {
  activePlayersMapSchema,
  activePlayersSchema,
  eventsSchema,
  playerSummarySchema,
  teamsSchema,
} from '../types/schemas.ts';
import cacheClient from './redis.ts';

export const getEvents = async () => {
  const eventsResponse = await cacheClient.get('events');
  const events = eventsSchema.parse(JSON.parse(eventsResponse) || []);

  return events;
};

export const getTeams = async () => {
  const teamsResponse = await cacheClient.get('teams');
  const teams = teamsSchema.parse(JSON.parse(teamsResponse) || []);

  return teams;
};

export const setTeams = async (teams: Team[]) => {
  await cacheClient.set('teams', JSON.stringify(teams));
};

export const getActivePlayers = async () => {
  const activePlayerResponse = await cacheClient.get('active_players');
  const activePlayers = activePlayersSchema.parse(
    JSON.parse(activePlayerResponse) || []
  );
  return activePlayers;
};

export const getActivePlayersMap = async () => {
  const activePlayerResponse = await cacheClient.get('active_players_map');
  const activePlayersMap = activePlayersMapSchema.parse(
    JSON.parse(activePlayerResponse) || {}
  );

  return activePlayersMap;
};

export const getPlayerHistory = async (key: string) => {
  const playerResponse = await cacheClient.get(key);
  const playerData = playerSummarySchema.parse(
    JSON.parse(playerResponse) || {}
  );

  return playerData;
};

export default cacheClient;
