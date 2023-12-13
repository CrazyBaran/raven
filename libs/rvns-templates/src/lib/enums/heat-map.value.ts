export const heatMapValues = ['great', 'good', 'average'] as const;

export type HeatMapValue = (typeof heatMapValues)[number];
