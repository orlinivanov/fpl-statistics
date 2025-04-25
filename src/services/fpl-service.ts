import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://fantasy.premierleague.com',
});

async function getBootstrapData() {
  const { data } = await instance.get<unknown>('/api/bootstrap-static/');
  return data;
}

async function getPlayerData(id: number) {
  const { data } = await instance.get<unknown>(`/api/element-summary/${id}/`)
  return data;
}

const fplService = {
  getBootstrapData,
  getPlayerData,
};

export default fplService;
