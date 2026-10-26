import assert from "node:assert/strict";
import test from "node:test";

import { parseDeskParams } from "../lib/deeplink.ts";

const DEFAULT = 63.23;

test("a plain visit keeps the default start minute", () => {
  assert.deepEqual(parseDeskParams("", DEFAULT), { minute: DEFAULT, paused: false });
  assert.deepEqual(parseDeskParams("?theme=dark", DEFAULT), { minute: DEFAULT, paused: false });
});

test("an empty at parameter keeps the default", () => {
  assert.deepEqual(parseDeskParams("?at=", DEFAULT), { minute: DEFAULT, paused: false });
  assert.deepEqual(parseDeskParams("?at=%20", DEFAULT), { minute: DEFAULT, paused: false });
});

test("a valid at parameter is honoured", () => {
  assert.equal(parseDeskParams("?at=63.23", DEFAULT).minute, 63.23);
  assert.equal(parseDeskParams("?at=0", DEFAULT).minute, 0);
  assert.equal(parseDeskParams("?at=90", DEFAULT).minute, 90);
});

test("an invalid at parameter falls back instead of crashing", () => {
  for (const bad of ["abc", "-1", "91", "NaN", "Infinity"]) {
    assert.equal(parseDeskParams(`?at=${bad}`, DEFAULT).minute, DEFAULT, bad);
  }
});

test("paused is only true when asked", () => {
  assert.equal(parseDeskParams("?at=63&paused=1", DEFAULT).paused, true);
  assert.equal(parseDeskParams("?at=63&paused=0", DEFAULT).paused, false);
  assert.equal(parseDeskParams("?at=63&paused=true", DEFAULT).paused, false);
});
