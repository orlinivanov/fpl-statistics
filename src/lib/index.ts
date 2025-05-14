import type { FplElement, FplElementType, FplTeam } from '../types/index.ts';

export function getPlayersWithMinutes(
  elements: FplElement[],
  elementTypes: FplElementType[],
  teams: FplTeam[]
) {
  const playersWithMinutes = elements.filter(({ minutes }) => {
    return minutes > 0;
  });

  const activePlayersMap = playersWithMinutes.reduce((acc, curr) => {
    const { id, web_name, total_points, element_type, team } = curr;
    if (id) {
      acc[`player_${id}`] = {
        id,
        name: web_name,
        total_points,
        position: elementTypes
          .filter(({ id }) => id === element_type)
          .reduce((_acc, { singular_name_short }) => singular_name_short, ''),
        team: teams
          .filter(({ id }) => id === team)
          .reduce((_acc, { short_name }) => short_name, ''),
      };
    }

    return acc;
  }, {});

  return activePlayersMap;
}

export function filterByTeam(teamInput: string, teamName: string) {
  if (!teamInput) {
    return true;
  }

  return teamInput === teamName;
}
