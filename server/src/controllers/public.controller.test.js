import test from "node:test";
import assert from "node:assert/strict";
import { validateFeedbackPayload } from "./public.controller.js";

test("validateFeedbackPayload accepts a complete feedback form", () => {
  const result = validateFeedbackPayload({
    fullName: "Asha Rao",
    email: "asha@example.com",
    category: "Food Quality",
    rating: 5,
    message: "The food arrived hot and fresh.",
  });

  assert.deepEqual(result, { ok: true, errors: {} });
});

test("validateFeedbackPayload rejects missing required fields", () => {
  const result = validateFeedbackPayload({
    fullName: "",
    email: "",
    category: "",
    message: "",
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.fullName, /required/i);
  assert.match(result.errors.email, /required/i);
  assert.match(result.errors.category, /required/i);
  assert.match(result.errors.message, /required/i);
});