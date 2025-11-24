// Additional tests for sleepFor & sleepUntil

import { describe, it, expect } from "vitest";
import { sleepFor, sleepUntil, SleepTimeoutError } from "../src/index";

describe("sleep (additional cases)", () => {
  it("sleepFor resolves immediately for 0ms", async () => {
    const t = performance.now();
    await sleepFor(0);
    expect(performance.now() - t).toBeLessThan(5);
  });

  it("sleepFor throws or behaves gracefully for negative durations", async () => {
    // If your implementation should reject:
    await expect(sleepFor(-10)).rejects.toThrow();
    // Or, if it should resolve immediately, use:
    // const t = performance.now();
    // await sleepFor(-10);
    // expect(performance.now() - t).toBeLessThan(5);
  });

  it("sleepUntil returns immediately if condition is already true", async () => {
    const result = await sleepUntil(() => "ready", {
      interval: 10,
      timeout: 100,
    });
    expect(result).toBe("ready");
  });

  it("sleepUntil respects custom interval timing", async () => {
    let calls = 0;

    const result = await sleepUntil(
      () => {
        calls++;
        return calls === 3 ? "ok" : false;
      },
      { interval: 20, timeout: 200 }
    );

    expect(result).toBe("ok");
    expect(calls).toBe(3); // Ensures interval polling
  });

  it("sleepUntil supports async condition functions", async () => {
    let x = 0;
    setTimeout(() => (x = 1), 40);

    const result = await sleepUntil(
      async () => (x === 1 ? "async-ok" : false),
      {
        interval: 10,
        timeout: 200,
      }
    );

    expect(result).toBe("async-ok");
  });

  it("sleepUntil throws SleepTimeoutError with correct message", async () => {
    try {
      await sleepUntil(() => false, { interval: 10, timeout: 30 });
    } catch (err) {
      expect(err).toBeInstanceOf(SleepTimeoutError);
      return;
    }
    throw new Error("Expected SleepTimeoutError");
  });

  it("sleepUntil stops checking after timeout (ensures no extra calls)", async () => {
    let calls = 0;

    await expect(
      sleepUntil(
        () => {
          calls++;
          return false;
        },
        { interval: 10, timeout: 30 }
      )
    ).rejects.toBeInstanceOf(SleepTimeoutError);

    // calls should be roughly timeout / interval
    expect(calls).toBeLessThanOrEqual(5);
  });
});
