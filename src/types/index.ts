import { z } from 'zod';

import {
  activePlayerSchema,
  bootStrapResponseSchema,
  elementSchema,
  elementTypeSchema,
  playerSummarySchema,
  teamSchema,
} from './schemas.ts';

export type FplElementType = z.infer<typeof elementTypeSchema>;
export type FplTeam = z.infer<typeof teamSchema>;
export type FplElement = z.infer<typeof elementSchema>;
export type BootstrapResponse = z.infer<typeof bootStrapResponseSchema>;
export type PlayerSummary = z.infer<typeof playerSummarySchema>;
export type ActivePlayersMap = z.infer<typeof activePlayerSchema>;
export type Team = z.infer<typeof teamSchema>;
