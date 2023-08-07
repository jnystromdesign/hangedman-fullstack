import assert from "node:assert";
import test, { describe, it } from "node:test";
import { compliesWithRules, maskWord, updateMaskedWord } from "./utils";

describe("maskWord", () => {
  it("Will replace letters in word with equal numbers of *", (t) => {
    const word = "cypoint";
    const masked = maskWord(word);
    assert.strictEqual(masked, "*******");
  });
});

describe("updateMaskedWord", () => {
  it("Will replace correct letter in masked word", (t) => {
    const word = "therese";
    const letter = "e";
    const currentProgress = "*******";
    const result = updateMaskedWord(word, letter, currentProgress);
    const expected = "**e*e*e";
    // This test passes because it does not throw an exception.
    assert.strictEqual(result, expected);
  });
});

describe("compliesWithRules", () => {
  it("Accept one lowercase letter", () => {
    const result = compliesWithRules("l");
    assert.strictEqual(result, true);
  });

  it("Rejects two or more letters", () => {
    const result = compliesWithRules("ll");
    assert.strictEqual(result, false);
  });

  it("Rejects uppercase letter", () => {
    const result = compliesWithRules("L");
    assert.strictEqual(result, false);
  });

  it("Rejects numbers and non-letters", () => {
    assert.strictEqual(compliesWithRules("1"), false);
    assert.strictEqual(compliesWithRules("?"), false);
    assert.strictEqual(compliesWithRules("."), false);
  });
});
