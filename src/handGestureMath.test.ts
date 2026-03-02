import { describe, expect, it } from "vitest";
import { getClosenessDelta, getZoomFactorFromCloseness } from "./handGestureMath";

describe("hand gesture zoom math", () => {
  it("returns positive closeness delta when hands move closer", () => {
    const closenessDelta = getClosenessDelta(0.32, 0.24);
    expect(closenessDelta).toBeGreaterThan(0);
  });

  it("zooms out when hands get closer", () => {
    const closenessDelta = getClosenessDelta(0.32, 0.24);
    const factor = getZoomFactorFromCloseness(closenessDelta);
    expect(factor).toBeGreaterThan(1);
  });

  it("zooms in when hands move farther apart", () => {
    const closenessDelta = getClosenessDelta(0.24, 0.32);
    const factor = getZoomFactorFromCloseness(closenessDelta);
    expect(factor).toBeLessThan(1);
  });

  it("clamps zoom factor to configured bounds", () => {
    expect(getZoomFactorFromCloseness(10)).toBe(1.2);
    expect(getZoomFactorFromCloseness(-10)).toBe(0.85);
  });
});

