import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("keeps the selected brand palette and accessible foreground pairs", async () => {
  const styles = await readFile(new URL("styles.css", root), "utf8");

  for (const token of [
    "--ink: #0d1212",
    "--brand: #34484a",
    "--brand-mid: #5b8279",
    "--brand-cyan: #64d5b3",
    "--aloe: #d3e4df",
    "--mint: #c4dbd4",
  ]) {
    assert.ok(styles.includes(token), token);
  }

  for (const [foreground, background] of [
    ["#0d1212", "#64d5b3"],
    ["#ffffff", "#34484a"],
    ["#64d5b3", "#34484a"],
    ["#34484a", "#d3e4df"],
    ["#ffffff", "#b52f3b"],
    ["#ffffff", "#6d47c4"],
  ]) {
    assert.ok(contrast(foreground, background) >= 4.5, `${foreground} on ${background}`);
  }
});

test("shows Hugo's full maker credit", async () => {
  const [index, readme] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("README.md", root), "utf8"),
  ]);

  assert.ok(index.includes("Made by Hyungtae &quot;Hugo&quot; Lim"));
  assert.ok(readme.includes('Made by Hyungtae "Hugo" Lim.'));
});
