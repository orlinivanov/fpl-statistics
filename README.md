# Fantasy Premier League Statistics

Fetch expected goals (xG), expected assists (xA), expected goal involvements (xGi) and expected goals conceded (xGc) stats from the actual FPL App and generate reports for the top 20 FWD, MID and DEF.

# Usage

### Prerequisites

- Node.js v.23 or later, with native typescript support
- Redis or Docker

### Run

#### Start Redis

```
docker run \
  -p 127.0.0.1:6379:6379/tcp \
  --name=my-redis-server \
  -d \
  --rm \
  -ti redis:7.0-alpine \
```

#### Load player data in Redis cache

```
node src/load.ts
```

#### Calclulate and Store reports
Default reports are calculated for the last 6 games for all players from all teams. They are stored in the local file system under a directory named with starting and ending year of the season, e.g. `2024-2025`.
```
node src/reports.ts
```

To calculate reports for a specific team or different number of games use the below command. In this case, the file name will include the team and number of games.
```
node src/reports.ts "LIV" 3
```

# Pre-typescript usage

`node ../src/index.js > gw_27_last_6.json`

`node ../src/index.js "" 3 > gw_27_last_3.json`
