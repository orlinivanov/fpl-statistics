import { createClient } from 'redis';

console.log('Starting Redis client...');
const client = createClient();
client.on('error', (err) => console.error('Redis Client Error', err));
await client.connect();
console.log('Redis client connected successfully!');

export default client;
