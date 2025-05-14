import axios from 'axios';

import type { BootstrapResponse, PlayerSummary } from '../types/index.ts';

const instance = axios.create({
  baseURL: 'https://fantasy.premierleague.com',
});

async function getBootstrapData() {
  const { data } = await instance.get<BootstrapResponse>(
    '/api/bootstrap-static/'
  );
  return data;
}

async function getPlayerData(id: number) {
  const { data } = await instance.get<PlayerSummary>(`/api/element-summary/${id}/`);
  return data;
}

const fplService = {
  getBootstrapData,
  getPlayerData,
};

export default fplService;
