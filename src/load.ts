import process from 'node:process';
import cacheClient from './clients/redis.ts';

import fplService from './services/fpl-service.ts';

process.on('exit', (code) => {
  console.log(`Process exited with code: ${code}`);
  if (code !== 0) {
    console.error('An error occurred, exiting process...');
  }
});

const { elements, element_types, teams, events } =
  await fplService.getBootstrapData();

const clientSetEventsResponse = await cacheClient.set(
  'events',
  JSON.stringify(events)
);
console.log(`Cached data for events with response ${clientSetEventsResponse}`);

const clientSetTeamsResponse = await cacheClient.set(
  'teams',
  JSON.stringify(teams)
);
console.log(`Cached data for teams with response ${clientSetTeamsResponse}`);

const playersWithMinutes = elements.filter(({ minutes }) => {
  return minutes > 0;
});

const activePlayers = playersWithMinutes.map((player) => {
  const { id, web_name, total_points, element_type, team } = player;
  return {
    id,
    name: web_name,
    total_points,
    position: element_types.find(({ id }) => id === element_type)
      .singular_name_short,
    team: teams.find(({ id }) => id === team).short_name,
  };
});

const clientSetActivePlayersResponse = await cacheClient.set(
  'active_players',
  JSON.stringify(activePlayers)
);
console.log(
  `Cached data for active players with response ${clientSetActivePlayersResponse}`
);

const activePlayersMap = playersWithMinutes.reduce((acc, curr) => {
  const { id, web_name, total_points, element_type, team } = curr;
  if (id) {
    acc[`player_${id}`] = {
      id,
      name: web_name,
      total_points,
      position: element_types
        .filter(({ id }) => id === element_type)
        .reduce((_acc, { singular_name_short }) => singular_name_short, ''),
      team: teams
        .filter(({ id }) => id === team)
        .reduce((_acc, { short_name }) => short_name, ''),
    };
  }

  return acc;
}, {});

const clientSetActivePlayerResponse = await cacheClient.set(
  'active_players_map',
  JSON.stringify(activePlayersMap)
);
console.log(
  `Cached data for active players with response ${clientSetActivePlayerResponse}`
);

for (const i in playersWithMinutes) {
  const playerIndex = Number(i);
  const { id } = playersWithMinutes[playerIndex];
  console.log(
    `Processing player ${playerIndex + 1} of ${playersWithMinutes.length}`
  );
  const key = `player_${id}`;
  const cachedValue = await cacheClient.get(key);
  if (!cachedValue) {
    console.log(`Fetching data for player ${key}`);
    const playerData = await fplService.getPlayerData(id);
    const clientSetPlyaerResponse = await cacheClient.set(
      key,
      JSON.stringify(playerData)
    );
    console.log(
      `Cached data for player ${key} with response ${clientSetPlyaerResponse}`
    );
  }
}

process.exit(0);
