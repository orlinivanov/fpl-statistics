import { argv } from 'node:process';
import axios from 'axios';

const [_0, _1, ...params] = argv;

const [teamInput, lastXInput, ...rest] = params;

const lastXGames = lastXInput || 6;

// console.log('Fetching data from FPL');
axios
  .get('https://fantasy.premierleague.com/api/bootstrap-static/')
  .then(({ data }) => {
    const { elements, element_types, teams } = data;
    const playersWithPoints = elements.filter(({ total_points }) => {
      return total_points != 0;
    });
    // console.log({
    //   players_with_points: playersWithPoints.length,
    //   total_players: elements.length,
    // });

    const activePlaeyrsMap = playersWithPoints.reduce((acc, curr) => {
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

    // console.log(activePlaeyrsMap);

    const promises = playersWithPoints.map(({ id }) => {
      return axios.get(
        `https://fantasy.premierleague.com/api/element-summary/${id}/`
      );
    });

    Promise.all(promises).then((results) => {
      results.forEach(({ data }) => {
        const { history } = data;
        const lastX = history.reverse().slice(0, lastXGames);
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
        const starts = lastX
          .reduce((acc, { starts }) => {
            acc = acc + +starts;
            return acc;
          }, 0)
          .toFixed(2);
        const { element } = history[0];
        // activePlaeyrsMap[`player_${element}`].history = [...history];
        // const playerSats = { starts, xG, xA, xGi, xGc };
        // activePlaeyrsMap[`player_${element}`] = {};
        // activePlaeyrsMap[`player_${element}`] = { ...playerSats };
        activePlaeyrsMap[`player_${element}`].starts = starts;
        activePlaeyrsMap[`player_${element}`].xG = xG;
        activePlaeyrsMap[`player_${element}`].xA = xA;
        activePlaeyrsMap[`player_${element}`].xGi = xGi;
        activePlaeyrsMap[`player_${element}`].xGc = xGc;
      });
      const topFwdXGi = Object.keys(activePlaeyrsMap)
        .map((key) => activePlaeyrsMap[key])
        .filter(
          ({ position, team }) =>
            position === 'FWD' && filterByTeam(teamInput, team)
        )
        .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);
      const topMidXGi = Object.keys(activePlaeyrsMap)
        .map((key) => activePlaeyrsMap[key])
        .filter(
          ({ position, team }) =>
            position === 'MID' && filterByTeam(teamInput, team)
        )
        .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);
      const topDefXGi = Object.keys(activePlaeyrsMap)
        .map((key) => activePlaeyrsMap[key])
        .filter(
          ({ position, team }) =>
            position === 'DEF' && filterByTeam(teamInput, team)
        )
        .sort(({ xGi: axGi }, { xGi: bxGi }) => bxGi - axGi);
      const topDefXGc = Object.keys(activePlaeyrsMap)
        .map((key) => activePlaeyrsMap[key])
        .filter(
          ({ position, team, xGc, starts }) =>
            position === 'DEF' &&
            filterByTeam(teamInput, team) &&
            +xGc !== 0 &&
            starts > 1
        )
        .sort(({ xGc: axGc }, { xGc: bxGc }) => axGc - bxGc);
      console.log(
        JSON.stringify({
          title: `Stats for last ${lastXGames}`,
          active_players: playersWithPoints.length,
          top_fwd_xgi: topFwdXGi.slice(0, 20),
          top_mid_xgi: topMidXGi.slice(0, 20),
          top_def_xgc: topDefXGc.slice(0, 20),
          top_def_xgi: topDefXGi.slice(0, 20),
        })
      );
      // console.log('Top 20 Forwards by xGi', topFwdXGi.slice(0, 20));
      // console.log('Top 20 Midfielders by xGi', topMidXGi.slice(0, 20));
      // console.log('Top 20 Defenders by xGi', topDefXGi.slice(0, 20));
      // console.log('Top 20 Defenders by xGc', topDefXGc.slice(0, 20));
    });
  })
  .catch((err) => console.log(err));

function filterByTeam(teamInput, teamName) {
  if (!teamInput) {
    return true;
  }

  return teamInput === teamName;
}
