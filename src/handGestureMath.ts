const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const getClosenessDelta = (previousDistance: number, currentDistance: number) =>
  previousDistance - currentDistance;

export const getZoomFactorFromCloseness = (
  closenessDelta: number,
  sensitivity = 2.4,
  minFactor = 0.85,
  maxFactor = 1.2,
) => clamp(1 + closenessDelta * sensitivity, minFactor, maxFactor);

