import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("loads one cache-busted asset graph across service-worker upgrades", async () => {
  const [index, app, worker] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
    readFile(new URL("sw.js", root), "utf8"),
  ]);

  const version = index.match(/\.\/app\.js\?v=(\d+)/)?.[1];
  assert.ok(version, "index.html must load a versioned app module");

  const expectedAssets = [
    `./styles.css?v=${version}`,
    `./app.js?v=${version}`,
    `./schedule-data.js?v=${version}`,
    `./service-calendar.js?v=${version}`,
    `./manifest.webmanifest?v=${version}`,
  ];

  for (const asset of expectedAssets) {
    assert.ok(
      index.includes(asset) || app.includes(asset),
      `${asset} must be referenced by the page's module graph`,
    );
    assert.ok(worker.includes(`"${asset}"`), `${asset} must be pre-cached exactly`);
  }

  assert.ok(worker.includes(`zchedule-shell-v${version}`));
});
