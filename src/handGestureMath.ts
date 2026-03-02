const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const getClosenessDelta = (previousDistance: number, currentDistance: number) =>
  previousDistance - currentDistance;

export const getZoomFactorFromCloseness = (
  closenessDelta: number,
  sensitivity = 2.4,
  minFactor = 0.85,
  maxFactor = 1.2,
) => clamp(1 + closenessDelta * sensitivity, minFactor, maxFactor);

export const normalizeAngleDelta = (delta: number) => {
  let normalized = delta;
  while (normalized > Math.PI) normalized -= Math.PI * 2;
  while (normalized < -Math.PI) normalized += Math.PI * 2;
  return normalized;
};

export const getAngleDelta = (previousAngle: number, currentAngle: number) =>
  normalizeAngleDelta(currentAngle - previousAngle);
