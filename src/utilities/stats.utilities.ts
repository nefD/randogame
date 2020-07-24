import {STATS, StatsKey} from "models/character/stats";

export const isStatKey = (k: string | StatsKey): k is StatsKey => {
  return Object.keys(STATS).includes(k);
}
