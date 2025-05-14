import { z } from 'zod';

export const eventSchema = z.object({
  id: z.number(),
  finished: z.boolean(),
  is_current: z.boolean(),
  is_next: z.boolean(),
  is_previous: z.boolean(),
  deadline_time: z.string(),
});

export const eventsSchema = z.array(eventSchema);

export const elementSchema = z.object({
  id: z.number(),
  web_name: z.string(),
  total_points: z.number(),
  minutes: z.number(),
  element_type: z.number(),
  team: z.number(),
});

export const elementsSchema = z.object({
  elements: z.array(elementSchema),
});

export const elementTypeSchema = z.object({
  id: z.number(),
  singular_name_short: z.string(),
});

export const teamSchema = z.object({
  id: z.number(),
  short_name: z.string(),
});

export const teamsSchema = z.array(teamSchema);

export const bootStrapResponseSchema = z.object({
  events: z.array(eventSchema),
  elements: z.array(elementSchema),
  element_types: z.array(elementTypeSchema),
  teams: z.array(teamSchema),
});

export const historyItemSchema = z.object({
  element: z.number(),
  opponent_team: z.number(),
  expected_goals: z.coerce.number(),
  expected_assists: z.coerce.number(),
  expected_goal_involvements: z.coerce.number(),
  expected_goals_conceded: z.coerce.number(),
  bps: z.coerce.number(),
  starts: z.coerce.number(),
});

export const playerSummarySchema = z.object({
  history: z.array(historyItemSchema).optional(),
});

export const activePlayerSchema = z.object({
  id: z.number(),
  name: z.string(),
  total_points: z.number(),
  position: z.string(),
  team: z.string(),
  starts: z.number().optional(),
  bps: z.number().optional(),
  xG: z.number().optional(),
  xA: z.number().optional(),
  xGi: z.number().optional(),
  xGc: z.number().optional(),
  history: z.array(historyItemSchema).optional(),
});

export const activePlayersSchema = z.array(activePlayerSchema);

export const activePlayersMapSchema = z.record(z.string(), activePlayerSchema);
